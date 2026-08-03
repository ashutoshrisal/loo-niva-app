const { query } = require('../config/db');

// ======================
// GET ALL ACTIVITIES
// ======================

async function getActivities(filters = {}) {
  const { search, project_id, activity_type } = filters;

  let sql = `
    SELECT
      a.*,
      p.title AS project_title,
      u.full_name AS conducted_by_name
    FROM activities a
    LEFT JOIN projects p
      ON p.id = a.project_id
    LEFT JOIN users u
      ON u.id = a.conducted_by
    WHERE 1=1
  `;

  const params = [];

  if (search) {
    params.push(`%${search}%`);
    sql += `
      AND (
        a.title ILIKE $${params.length}
        OR a.venue ILIKE $${params.length}
      )
    `;
  }

  if (project_id) {
    params.push(project_id);
    sql += ` AND a.project_id = $${params.length}`;
  }

  if (activity_type) {
    params.push(activity_type);
    sql += ` AND a.activity_type = $${params.length}`;
  }

  sql += `
    ORDER BY
      activity_date DESC,
      start_time DESC
  `;

  const result = await query(sql, params);

  return result.rows;
}

// ======================
// GET ONE ACTIVITY
// ======================

async function getActivity(id) {

  const result = await query(
    `
    SELECT
      a.*,
      p.title AS project_title,
      u.full_name AS conducted_by_name
    FROM activities a
    LEFT JOIN projects p
      ON p.id = a.project_id
    LEFT JOIN users u
      ON u.id = a.conducted_by
    WHERE a.id=$1
    `,
    [id]
  );

  return result.rows[0];

}

// ======================
// CREATE
// ======================

async function createActivity(data) {

  const result = await query(
    `
    INSERT INTO activities
    (
      project_id,
      title,
      activity_type,
      description,
      venue,
      activity_date,
      start_time,
      end_time,
      budget,
      conducted_by
    )
    VALUES
    ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *
    `,
    [
      data.project_id || null,
      data.title,
      data.activity_type,
      data.description,
      data.venue,
      data.activity_date,
      data.start_time,
      data.end_time,
      data.budget || 0,
      data.conducted_by || null,
    ]
  );

  return result.rows[0];

}

// ======================
// UPDATE
// ======================

async function updateActivity(id, data) {

  const result = await query(
    `
    UPDATE activities
    SET

      project_id=$1,
      title=$2,
      activity_type=$3,
      description=$4,
      venue=$5,
      activity_date=$6,
      start_time=$7,
      end_time=$8,
      budget=$9,
      conducted_by=$10

    WHERE id=$11

    RETURNING *
    `,
    [
      data.project_id || null,
      data.title,
      data.activity_type,
      data.description,
      data.venue,
      data.activity_date,
      data.start_time,
      data.end_time,
      data.budget || 0,
      data.conducted_by || null,
      id,
    ]
  );

  return result.rows[0];

}

// ======================
// DELETE
// ======================

async function deleteActivity(id) {

  await query(
    `
    DELETE FROM activities
    WHERE id=$1
    `,
    [id]
  );

}

module.exports = {

  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,

};