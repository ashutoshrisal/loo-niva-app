const activityModel = require('../models/activityModel');

// ==========================
// GET ALL ACTIVITIES
// ==========================

exports.getActivities = async (req, res) => {
  try {

    const activities = await activityModel.getActivities(req.query);

    res.json({
      success: true,
      data: activities,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: 'Failed to load activities',
    });

  }
};

// ==========================
// GET ONE ACTIVITY
// ==========================

exports.getActivity = async (req, res) => {

  try {

    const activity = await activityModel.getActivity(req.params.id);

    if (!activity) {

      return res.status(404).json({
        success: false,
        message: 'Activity not found',
      });

    }

    res.json({
      success: true,
      data: activity,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: 'Failed to load activity',
    });

  }

};

// ==========================
// CREATE ACTIVITY
// ==========================

exports.createActivity = async (req, res) => {

  try {

    if (!req.body.title) {

      return res.status(400).json({
        success: false,
        message: 'Activity title is required',
      });

    }

    const activity = await activityModel.createActivity(req.body);

    res.status(201).json({
      success: true,
      data: activity,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: 'Failed to create activity',
    });

  }

};

// ==========================
// UPDATE ACTIVITY
// ==========================

exports.updateActivity = async (req, res) => {

  try {

    const activity = await activityModel.updateActivity(
      req.params.id,
      req.body
    );

    if (!activity) {

      return res.status(404).json({
        success: false,
        message: 'Activity not found',
      });

    }

    res.json({
      success: true,
      data: activity,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: 'Failed to update activity',
    });

  }

};

// ==========================
// DELETE ACTIVITY
// ==========================

exports.deleteActivity = async (req, res) => {

  try {

    await activityModel.deleteActivity(req.params.id);

    res.json({
      success: true,
      message: 'Activity deleted successfully',
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: 'Failed to delete activity',
    });

  }

};