const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

function signTokens(user) {
  const accessToken = jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h',
    }
  );

  const refreshToken = jwt.sign(
    {
      sub: user.id,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn:
        process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    }
  );

  return {
    accessToken,
    refreshToken,
  };
}

// ==========================================
// LOGIN
// ==========================================

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const result = await query(
      `SELECT
          u.id,
          u.full_name,
          u.email,
          u.password_hash,
          u.is_active,
          r.name AS role
       FROM users u
       JOIN roles r ON r.id = u.role_id
       WHERE u.email = $1`,
      [email.toLowerCase().trim()]
    );

    const user = result.rows[0];

if (!user) {
  return res.status(401).json({
    success: false,
    message: 'Invalid email or password',
  });
}

const valid = await bcrypt.compare(
  password,
  user.password_hash
);

    if (!valid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    await query(
      'UPDATE users SET last_login = now() WHERE id = $1',
      [user.id]
    );

    const tokens = signTokens(user);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.full_name,
          email: user.email,
          role: user.role,
        },
        ...tokens,
      },
    });
  } catch (err) {
    console.error('Login error:', err);

    res.status(500).json({
      success: false,
      message: 'Login failed',
    });
  }
}

// ==========================================
// REFRESH TOKEN
// ==========================================

async function refresh(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: 'Refresh token required',
    });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const result = await query(
      `SELECT
          u.id,
          r.name AS role
       FROM users u
       JOIN roles r ON r.id = u.role_id
       WHERE u.id = $1
       AND u.is_active = true`,
      [decoded.sub]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }

    const tokens = signTokens(user);

    res.json({
      success: true,
      data: tokens,
    });
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token',
    });
  }
}

// ==========================================
// CURRENT USER
// ==========================================

async function me(req, res) {
  res.json({
    success: true,
    data: req.user,
  });
}

// ==========================================
// CHANGE PASSWORD
// ==========================================

async function changePassword(req, res) {
  try {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    // Validate fields
    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: 'All password fields are required',
      });
    }

    // Check new passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New passwords do not match',
      });
    }

    // Basic password length validation
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          'New password must be at least 8 characters long',
      });
    }

    // Get current user's password hash
    const result = await query(
      `SELECT
          id,
          password_hash
       FROM users
       WHERE id = $1
       AND is_active = true`,
      [req.user.id]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify current password
    const valid = await bcrypt.compare(
      currentPassword,
      user.password_hash
    );

    if (!valid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Prevent using same password
    const samePassword = await bcrypt.compare(
      newPassword,
      user.password_hash
    );

    if (samePassword) {
      return res.status(400).json({
        success: false,
        message:
          'New password must be different from the current password',
      });
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(
      newPassword,
      10
    );

    // Update database
    await query(
      `UPDATE users
       SET password_hash = $1
       WHERE id = $2`,
      [
        newPasswordHash,
        user.id,
      ]
    );

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (err) {
    console.error(
      'Change password error:',
      err
    );

    res.status(500).json({
      success: false,
      message: 'Failed to change password',
    });
  }
}

// ==========================================
// REGISTER
// ==========================================

async function register(req, res) {
  try {
    const {
      full_name,
      email,
      password,
      role_id,
      phone,
      designation,
    } = req.body;

    if (!full_name || !email || !password || !role_id) {
      return res.status(400).json({
        success: false,
        message:
          'Full name, email, password and role are required',
      });
    }

    const passwordHash = await bcrypt.hash(
      password,
      10
    );

    const result = await query(
      `INSERT INTO users
      (
        full_name,
        email,
        phone,
        password_hash,
        role_id,
        designation
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING id, full_name, email`,
      [
        full_name,
        email.toLowerCase().trim(),
        phone || null,
        passwordHash,
        role_id,
        designation || null,
      ]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error(
      'Register error:',
      err
    );

    res.status(500).json({
      success: false,
      message: 'Failed to register user',
    });
  }
}
async function updateProfile(req, res) {
  try {
    const {
      full_name,
      email,
      phone,
      designation,
    } = req.body;

    if (!full_name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required',
      });
    }

    const existingUser = await query(
      `SELECT id
       FROM users
       WHERE LOWER(email) = LOWER($1)
       AND id != $2`,
      [
        email.trim(),
        req.user.id,
      ]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'This email is already being used by another user',
      });
    }

    const result = await query(
      `UPDATE users
       SET
         full_name = $1,
         email = $2,
         phone = $3,
         designation = $4
       WHERE id = $5
       AND is_active = true
       RETURNING
         id,
         full_name,
         email,
         phone,
         designation`,
      [
        full_name.trim(),
        email.trim().toLowerCase(),
        phone || null,
        designation || null,
        req.user.id,
      ]
    );

    if (result.rows.length === 0) {
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
    console.error('Update profile error:', err);

    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
    });
  }
}


module.exports = {
  login,
  refresh,
  me,
  register,
  changePassword,
  updateProfile,
};
