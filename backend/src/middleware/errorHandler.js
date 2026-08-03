/* eslint-disable no-unused-vars */

/**
 * Centralized error handler. Keeps internal details out of client responses
 * in production while logging full detail server-side.
 */
function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err);

  // Multer / file validation errors
  if (err.message === 'Unsupported file type') {
    return res.status(400).json({ success: false, message: err.message });
  }

  // Postgres unique violation
  if (err.code === '23505') {
    return res.status(409).json({ success: false, message: 'A record with these details already exists' });
  }

  // Postgres foreign key violation
  if (err.code === '23503') {
    return res.status(400).json({ success: false, message: 'Related record not found' });
  }

  const status = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' && status === 500
    ? 'Internal server error'
    : err.message || 'Internal server error';

  res.status(status).json({ success: false, message });
}

function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
}

module.exports = { errorHandler, notFound };
