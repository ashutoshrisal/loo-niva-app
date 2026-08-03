const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

/**
 * Verify JWT Access Token
 */
async function authenticate(req, res, next) {
  console.log("AUTH HEADER:", req.headers.authorization);

  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ')
      ? header.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token missing',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("JWT DECODED:", decoded);

    const result = await query(
      `
      SELECT
        u.id,
        u.full_name,
        u.email,
        u.is_active,
        r.name AS role
      FROM users u
      JOIN roles r ON r.id = u.role_id
      WHERE u.id = $1
      `,
      [decoded.sub]
    );

    const user = result.rows[0];

    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account inactive or not found',
      });
    }

    req.user = {
      id: user.id,
      name: user.full_name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    console.error("JWT ERROR:", err.message);

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token',
    });
  }
}

/**
 * Role Based Access Control
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }

    next();
  };
}

module.exports = {
  authenticate,
  authorize,
};