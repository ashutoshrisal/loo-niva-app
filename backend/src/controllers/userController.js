const { query } = require('../config/db');


// ==========================================
// GET ALL USERS
// SUPER ADMIN
// ==========================================

async function listUsers(req, res) {
  try {
    const result = await query(
      `
      SELECT
        u.id,
        u.full_name,
        u.email,
        u.phone,
        u.designation,
        u.is_active,
        u.last_login,
        r.name AS role
      FROM users u
      JOIN roles r ON r.id = u.role_id
      ORDER BY u.created_at DESC
      `
    );

    res.json({
      success: true,
      data: result.rows,
    });

  } catch (err) {
    console.error('List users error:', err);

    res.status(500).json({
      success: false,
      message: 'Failed to load users',
    });
  }
}


// ==========================================
// GET CURRENT USER PROFILE
// ==========================================

async function getMyProfile(req, res) {
  try {

    const userId = req.user.id;

    const result = await query(
      `
      SELECT
        u.id,
        u.full_name,
        u.email,
        u.phone,
        u.designation,
        u.is_active,
        r.name AS role
      FROM users u
      JOIN roles r ON r.id = u.role_id
      WHERE u.id = $1
      `,
      [userId]
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });

  } catch (err) {
    console.error('Get my profile error:', err);

    res.status(500).json({
      success: false,
      message: 'Failed to load profile',
    });
  }
}


// ==========================================
// UPDATE CURRENT USER PROFILE
// ==========================================

async function updateMyProfile(req, res) {
  try {

    const userId = req.user.id;

    const {
      full_name,
      email,
      phone,
    } = req.body;

    if (!full_name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required',
      });
    }

    // Check whether another user already has this email
    const existing = await query(
      `
      SELECT id
      FROM users
      WHERE LOWER(email) = LOWER($1)
      AND id != $2
      LIMIT 1
      `,
      [email, userId]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'This email is already being used by another user',
      });
    }

    const result = await query(
      `
      UPDATE users
      SET
        full_name = $1,
        email = $2,
        phone = $3
      WHERE id = $4
      RETURNING
        id,
        full_name,
        email,
        phone,
        designation,
        is_active
      `,
      [
        full_name,
        email,
        phone || '',
        userId,
      ]
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: result.rows[0],
    });

  } catch (err) {
    console.error('Update my profile error:', err);

    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
    });
  }
}


// ==========================================
// UPDATE ANY USER
// SUPER ADMIN
// ==========================================

async function updateUser(req, res) {
  try {

    const {
      full_name,
      phone,
      designation,
      role_id,
      is_active,
    } = req.body;

    const updates = [];
    const params = [];

    const map = {
      full_name,
      phone,
      designation,
      role_id,
      is_active,
    };

    Object.entries(map).forEach(([key, value]) => {

      if (value !== undefined) {
        params.push(value);
        updates.push(
          `${key} = $${params.length}`
        );
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
      `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = $${params.length}
      RETURNING
        id,
        full_name,
        email,
        phone,
        designation,
        role_id,
        is_active
      `,
      params
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });

  } catch (err) {
    console.error('Update user error:', err);

    res.status(500).json({
      success: false,
      message: 'Failed to update user',
    });
  }
}


// ==========================================
// DEACTIVATE USER
// SUPER ADMIN
// ==========================================

async function deactivateUser(req, res) {
  try {

    const result = await query(
      `
      UPDATE users
      SET is_active = false
      WHERE id = $1
      RETURNING id
      `,
      [req.params.id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User deactivated',
    });

  } catch (err) {
    console.error('Deactivate user error:', err);

    res.status(500).json({
      success: false,
      message: 'Failed to deactivate user',
    });
  }
}


module.exports = {
  listUsers,
  getMyProfile,
  updateMyProfile,
  updateUser,
  deactivateUser,
};