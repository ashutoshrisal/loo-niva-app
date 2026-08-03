const express = require('express');
const router = express.Router();

const { authenticate } = require('../middleware/auth');
const { query } = require('../config/db');

router.use(authenticate);

// GET organization settings
router.get('/organization', async (req, res) => {
  try {
    const result = await query(`
      SELECT *
      FROM organization_settings
      ORDER BY id
      LIMIT 1
    `);

    res.json({
      success: true,
      data: result.rows[0] || null,
    });
  } catch (err) {
    console.error('Get organization settings error:', err);

    res.status(500).json({
      success: false,
      message: 'Failed to load organization settings',
    });
  }
});

// UPDATE organization settings
router.put('/organization', async (req, res) => {
  try {
    const {
      organization_name,
      email,
      phone,
      address,
      website,
      mission,
      vision,
    } = req.body;

    const result = await query(
      `
      UPDATE organization_settings
      SET
        organization_name = $1,
        email = $2,
        phone = $3,
        address = $4,
        website = $5,
        mission = $6,
        vision = $7
      WHERE id = (
        SELECT id
        FROM organization_settings
        ORDER BY id
        LIMIT 1
      )
      RETURNING *
      `,
      [
        organization_name,
        email,
        phone,
        address,
        website || '',
        mission || '',
        vision || '',
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Organization settings not found',
      });
    }

    res.json({
      success: true,
      message: 'Organization information updated successfully',
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Update organization settings error:', err);

    res.status(500).json({
      success: false,
      message: 'Failed to update organization settings',
    });
  }
});

module.exports = router;