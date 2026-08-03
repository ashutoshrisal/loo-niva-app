const { query } = require('../config/db');

async function listGallery(req, res) {
  const { project_id, media_type, search } = req.query;
  const conditions = [];
  const params = [];
  if (project_id) { params.push(project_id); conditions.push(`project_id = $${params.length}`); }
  if (media_type) { params.push(media_type); conditions.push(`media_type = $${params.length}`); }
  if (search) { params.push(`%${search}%`); conditions.push(`caption ILIKE $${params.length}`); }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const result = await query(`SELECT * FROM gallery ${whereClause} ORDER BY created_at DESC`, params);
  res.json({ success: true, data: result.rows });
}

async function addGalleryItem(req, res) {
  const { project_id, media_type, file_url, caption } = req.body;
  if (!file_url) return res.status(400).json({ success: false, message: 'file_url is required' });

  const result = await query(
    `INSERT INTO gallery (project_id, media_type, file_url, caption, uploaded_by) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [project_id || null, media_type || 'image', file_url, caption || null, req.user.id]
  );
  res.status(201).json({ success: true, data: result.rows[0] });
}

async function deleteGalleryItem(req, res) {
  const result = await query('DELETE FROM gallery WHERE id = $1 RETURNING id', [req.params.id]);
  if (!result.rows[0]) return res.status(404).json({ success: false, message: 'Item not found' });
  res.json({ success: true, message: 'Deleted' });
}

module.exports = { listGallery, addGalleryItem, deleteGalleryItem };
