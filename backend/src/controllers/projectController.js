const { query } = require('../config/db');

// GET /api/projects?status=active&category=education&search=reap&page=1&limit=10
async function listProjects(req, res) {
  const { status, category, search, page = 1, limit = 10 } = req.query;
  const conditions = [];
  const params = [];

  if (status) {
    params.push(status);
    conditions.push(`status = $${params.length}`);
  }
  if (category) {
    params.push(category);
    conditions.push(`category = $${params.length}`);
  }
if (search) {
    params.push(`%${search}%`);
    conditions.push(`(title ILIKE $${params.length} OR description ILIKE $${params.length})`);
  }

  // Viewers/Donors only ever see completed projects (read-only public view).
  if (req.user.role === 'viewer') {
    conditions.push(`status = 'completed'`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (Number(page) - 1) * Number(limit);

  const countResult = await query(`SELECT COUNT(*) FROM projects ${whereClause}`, params);
  const total = Number(countResult.rows[0].count);

  params.push(limit, offset);
  const dataResult = await query(
    `SELECT * FROM projects ${whereClause} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  res.json({
    success: true,
    data: dataResult.rows,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
  });
}

// GET /api/projects/:id
async function getProject(req, res) {
  const result = await query(
    `SELECT p.*, u.full_name AS created_by_name
     FROM projects p LEFT JOIN users u ON u.id = p.created_by
     WHERE p.id = $1`,
    [req.params.id]
  );
  if (!result.rows[0]) return res.status(404).json({ success: false, message: 'Project not found' });

  // Load project staff defensively against schema differences.
  // The `project_staff` table/columns may differ across environments
  // (e.g. `designation` vs `assigned_role`), so we detect the actual
  // columns before building the SELECT. If the table is unavailable,
  // the project itself must still load — we return an empty staff list.
  let staff = [];

try {
  const staffResult = await query(
    `SELECT
       ps.id,
       ps.user_id,
       u.full_name,
       u.email
     FROM project_staff ps
     JOIN users u ON u.id = ps.user_id
     WHERE ps.project_id = $1`,
    [req.params.id]
  );

  staff = staffResult.rows;
} catch (err) {
  console.error('[getProject] Failed to load project staff:', err.message);
  staff = [];
}

  res.json({ success: true, data: { ...result.rows[0], staff } });
}

// POST /api/projects  (super_admin, project_manager)
async function createProject(req, res) {

  const {
    project_code,
    title,
    category,
    description,
    donor_name,
    budget,
    start_date,
    end_date,
    status,
  } = req.body;

  if (!project_code || !title) {
    return res.status(400).json({
      success: false,
      message: 'Project Code and Title are required',
    });
  }

  const result = await query(
    `INSERT INTO projects
    (
      project_code,
      title,
      category,
      description,
      donor_name,
      budget,
      start_date,
      end_date,
      status,
      created_by
    )
    VALUES
    ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *`,
    [
      project_code,
      title,
      category,
      description,
      donor_name,
      budget || 0,
      start_date || null,
      end_date || null,
      status || 'planning',
      req.user.id,
    ]
  );

  res.status(201).json({
    success: true,
    data: result.rows[0],
  });

}

// PUT /api/projects/:id
async function updateProject(req, res) {

  const fields = [
    'project_code',
    'title',
    'category',
    'description',
    'donor_name',
    'budget',
    'start_date',
    'end_date',
    'status',
  ];

  const updates = [];
  const params = [];

  fields.forEach((field) => {

    if (req.body[field] !== undefined) {

      params.push(req.body[field]);

      updates.push(`${field} = $${params.length}`);

    }

  });

  if (!updates.length) {

    return res.status(400).json({
      success: false,
      message: 'No fields to update',
    });

  }

  params.push(req.params.id);

  const result = await query(

    `UPDATE projects
     SET ${updates.join(', ')},
         updated_at = NOW()
     WHERE id = $${params.length}
     RETURNING *`,

    params

  );

  if (!result.rows.length) {

    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });

  }

  res.json({
    success: true,
    data: result.rows[0],
  });

}

// DELETE /api/projects/:id  (super_admin only)
async function deleteProject(req, res) {
  const result = await query('DELETE FROM projects WHERE id = $1 RETURNING id', [req.params.id]);
  if (!result.rows[0]) return res.status(404).json({ success: false, message: 'Project not found' });
  res.json({ success: true, message: 'Project deleted' });
}

// POST /api/projects/:id/staff  (assign staff)
async function assignStaff(req, res) {
  const { user_id, designation } = req.body;
  const result = await query(
    `INSERT INTO project_staff (project_id, user_id, designation)
     VALUES ($1, $2, $3)
     ON CONFLICT (project_id, user_id) DO UPDATE SET designation = EXCLUDED.designation
     RETURNING *`,
    [req.params.id, user_id, designation || null]
  );
  res.status(201).json({ success: true, data: result.rows[0] });
}

module.exports = { listProjects, getProject, createProject, updateProject, deleteProject, assignStaff };
