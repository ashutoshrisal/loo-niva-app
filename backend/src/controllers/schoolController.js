const schoolModel = require('../models/schoolModel');

// GET /api/schools
async function getSchools(req, res) {
  try {
    const schools = await schoolModel.getAllSchools();

    res.json({
      success: true,
      data: schools,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch schools.',
    });
  }
}

// GET /api/schools/:id
async function getSchool(req, res) {
  try {
    const school = await schoolModel.getSchool(req.params.id);

    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found.',
      });
    }

    res.json({
      success: true,
      data: school,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch school.',
    });
  }
}

// POST /api/schools
async function createSchool(req, res) {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'School name is required.',
      });
    }

    const school = await schoolModel.createSchool(name);

    res.status(201).json({
      success: true,
      data: school,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// PUT /api/schools/:id
async function updateSchool(req, res) {
  try {
    const { name } = req.body;

    const school = await schoolModel.updateSchool(
      req.params.id,
      name
    );

    res.json({
      success: true,
      data: school,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// DELETE /api/schools/:id
async function deleteSchool(req, res) {
  try {
    await schoolModel.deleteSchool(req.params.id);

    res.json({
      success: true,
      message: 'School deleted successfully.',
    });
  } catch (err) {
    console.error(err);

    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  getSchools,
  getSchool,
  createSchool,
  updateSchool,
  deleteSchool,
};