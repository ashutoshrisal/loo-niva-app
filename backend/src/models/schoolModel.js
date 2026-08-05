const { query } = require('../config/db');

// Get all schools with student count
async function getAllSchools() {
  const result = await query(`
    SELECT
      s.id,
      s.name,
      s.address,
      s.municipality,
      s.district,
      s.province,
      s.principal_name,
      s.phone,
      s.email,
      s.established_year,
      s.is_active,
      COUNT(st.id) AS students
    FROM schools s
    LEFT JOIN students st
      ON st.school_id = s.id
    GROUP BY s.id
    ORDER BY s.name;
  `);

  return result.rows;
}

// Get one school
async function getSchool(id) {
  const result = await query(
    `SELECT * FROM schools WHERE id = $1`,
    [id]
  );

  return result.rows[0];
}

// Create school
async function createSchool(name) {
  const result = await query(
    `
    INSERT INTO schools (name)
    VALUES ($1)
    RETURNING *;
    `,
    [name]
  );

  return result.rows[0];
}

// Update school
async function updateSchool(id, name) {
  const result = await query(
    `
    UPDATE schools
    SET
      name = $1,
      updated_at = NOW()
    WHERE id = $2
    RETURNING *;
    `,
    [name, id]
  );

  return result.rows[0];
}

// Delete school
async function deleteSchool(id) {
  // Prevent deleting schools that still have students
  const check = await query(
    `
    SELECT COUNT(*) AS total
    FROM students
    WHERE school_id = $1;
    `,
    [id]
  );

  if (Number(check.rows[0].total) > 0) {
    throw new Error('School contains students.');
  }

  await query(
    `DELETE FROM schools WHERE id = $1`,
    [id]
  );
}

module.exports = {
  getAllSchools,
  getSchool,
  createSchool,
  updateSchool,
  deleteSchool,
};