const { query } = require('../config/db');

async function listDocuments(req, res) {
  const { category, project_id, search } = req.query;
  const conditions = [];
  const params = [];
  if (category) { params.push(category); conditions.push(`category = $${params.length}`); }
  if (project_id) { params.push(project_id); conditions.push(`project_id = $${params.length}`); }
  if (search) { params.push(`%${search}%`); conditions.push(`title ILIKE $${params.length}`); }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const result = await query(`SELECT * FROM documents ${whereClause} ORDER BY created_at DESC`, params);
  res.json({ success: true, data: result.rows });
}

async function createDocument(req, res) {
  const { title, category, project_id, file_url } = req.body;
  if (!title || !file_url) return res.status(400).json({ success: false, message: 'title and file_url are required' });

  const result = await query(
    `INSERT INTO documents (title, category, project_id, file_url, uploaded_by) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [title, category || 'other', project_id || null, file_url, req.user.id]
  );
  res.status(201).json({ success: true, data: result.rows[0] });
}

async function deleteDocument(req, res) {
  const result = await query('DELETE FROM documents WHERE id = $1 RETURNING id', [req.params.id]);
  if (!result.rows[0]) return res.status(404).json({ success: false, message: 'Document not found' });
  res.json({ success: true, message: 'Deleted' });
}

module.exports = { listDocuments, createDocument, deleteDocument };
