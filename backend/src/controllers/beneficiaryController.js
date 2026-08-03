const { query } = require('../config/db');

// GET ALL
exports.listBeneficiaries = async (req, res) => {
  try {
    const { search = '' } = req.query;

    const result = await query(
      `
      SELECT *
      FROM beneficiaries
      WHERE
        full_name ILIKE $1
        OR phone ILIKE $1
        OR email ILIKE $1
      ORDER BY created_at DESC
      `,
      [`%${search}%`]
    );

    res.json({
      success: true,
      data: result.rows,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: 'Failed to load beneficiaries.',
    });
  }
};

// GET ONE
exports.getBeneficiary = async (req, res) => {
  try {

    const result = await query(
      `SELECT * FROM beneficiaries WHERE id=$1`,
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: 'Beneficiary not found.',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: 'Server error.',
    });
  }
};

// CREATE
exports.createBeneficiary = async (req, res) => {
  try {

    const {
      full_name,
      gender,
      date_of_birth,
      address,
      phone,
      email,
      beneficiary_type,
      guardian_name,
      guardian_phone,
      notes,
      status,
    } = req.body;

    const result = await query(
      `
      INSERT INTO beneficiaries
      (
        full_name,
        gender,
        date_of_birth,
        address,
        phone,
        email,
        beneficiary_type,
        guardian_name,
        guardian_phone,
        notes,
        status,
        created_by
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
      )
      RETURNING *
      `,
      [
        full_name,
        gender || null,
        date_of_birth || null,
        address || null,
        phone || null,
        email || null,
        beneficiary_type || null,
        guardian_name || null,
        guardian_phone || null,
        notes || null,
        status || 'active',
        req.user.id,
      ]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: 'Failed to create beneficiary.',
    });
  }
};

// UPDATE
exports.updateBeneficiary = async (req, res) => {
  try {

    const {
      full_name,
      gender,
      date_of_birth,
      address,
      phone,
      email,
      beneficiary_type,
      guardian_name,
      guardian_phone,
      notes,
      status,
    } = req.body;

    const result = await query(
      `
      UPDATE beneficiaries
      SET
      full_name=$1,
      gender=$2,
      date_of_birth=$3,
      address=$4,
      phone=$5,
      email=$6,
      beneficiary_type=$7,
      guardian_name=$8,
      guardian_phone=$9,
      notes=$10,
      status=$11,
      updated_at=NOW()
      WHERE id=$12
      RETURNING *
      `,
      [
        full_name,
        gender,
        date_of_birth,
        address,
        phone,
        email,
        beneficiary_type,
        guardian_name,
        guardian_phone,
        notes,
        status,
        req.params.id,
      ]
    );

    res.json({
      success: true,
      data: result.rows[0],
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: 'Update failed.',
    });
  }
};

// DELETE
exports.deleteBeneficiary = async (req, res) => {
  try {

    await query(
      `DELETE FROM beneficiaries WHERE id=$1`,
      [req.params.id]
    );

    res.json({
      success: true,
      message: 'Beneficiary deleted.',
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: 'Delete failed.',
    });
  }
};