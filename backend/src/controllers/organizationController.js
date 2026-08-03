const { query } = require('../config/db');

// ==========================================
// GET ORGANIZATION SETTINGS
// ==========================================

exports.getOrganizationSettings = async (req, res) => {
  try {
    const result = await query(`
      SELECT
        id,
        organization_name,
        logo_url,
        address,
        phone,
        email,
        website,
        facebook,
        instagram,
        youtube,
        mission,
        vision
      FROM organization_settings
      ORDER BY id
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Organization settings not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Get organization settings error:', err);

    res.status(500).json({
      success: false,
      message: 'Failed to load organization settings',
    });
  }
};


// ==========================================
// UPDATE ORGANIZATION SETTINGS
// ==========================================

exports.updateOrganizationSettings = async (req, res) => {
  try {
    const {
      organization_name,
      logo_url,
      address,
      phone,
      email,
      website,
      facebook,
      instagram,
      youtube,
      mission,
      vision,
    } = req.body;

    const existing = await query(`
      SELECT id
      FROM organization_settings
      ORDER BY id
      LIMIT 1
    `);

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Organization settings not found',
      });
    }

    const id = existing.rows[0].id;

    const result = await query(
      `
      UPDATE organization_settings
      SET
        organization_name = $1,
        logo_url = $2,
        address = $3,
        phone = $4,
        email = $5,
        website = $6,
        facebook = $7,
        instagram = $8,
        youtube = $9,
        mission = $10,
        vision = $11
      WHERE id = $12
      RETURNING
        id,
        organization_name,
        logo_url,
        address,
        phone,
        email,
        website,
        facebook,
        instagram,
        youtube,
        mission,
        vision
      `,
      [
        organization_name || '',
        logo_url || '',
        address || '',
        phone || '',
        email || '',
        website || '',
        facebook || '',
        instagram || '',
        youtube || '',
        mission || '',
        vision || '',
        id,
      ]
    );

    res.json({
      success: true,
      message: 'Organization settings updated successfully',
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Update organization settings error:', err);

    res.status(500).json({
      success: false,
      message: 'Failed to update organization settings',
    });
  }
};