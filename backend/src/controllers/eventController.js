const { query } = require('../config/db');

async function listEvents(req, res) {
  const { from, to } = req.query;
  const conditions = [];
  const params = [];
  if (from) { params.push(from); conditions.push(`event_date >= $${params.length}`); }
  if (to) { params.push(to); conditions.push(`event_date <= $${params.length}`); }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const result = await query(`SELECT * FROM events ${whereClause} ORDER BY event_date ASC, start_time ASC`, params);
  res.json({ success: true, data: result.rows });
}

async function createEvent(req, res) {
  const { title, description, event_date, start_time, end_time, location } = req.body;
  if (!title || !event_date) return res.status(400).json({ success: false, message: 'title and event_date are required' });

  const result = await query(
    `INSERT INTO events (title, description, event_date, start_time, end_time, location, organizer)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [title, description || null, event_date, start_time || null, end_time || null, location || null, req.user.id]
  );
  res.status(201).json({ success: true, data: result.rows[0] });
}

async function deleteEvent(req, res) {
  const result = await query('DELETE FROM events WHERE id = $1 RETURNING id', [req.params.id]);
  if (!result.rows[0]) return res.status(404).json({ success: false, message: 'Event not found' });
  res.json({ success: true, message: 'Deleted' });
}

module.exports = { listEvents, createEvent, deleteEvent };
