const express = require('express');
const router = express.Router();

const { authenticate } = require('../middleware/auth');
const activityController = require('../controllers/activityController');

router.use(authenticate);

// ==========================
// GET ACTIVITIES
// ==========================

router.get('/', activityController.getActivities);

router.get('/:id', activityController.getActivity);

// ==========================
// CREATE ACTIVITY
// ==========================

router.post('/', activityController.createActivity);

// ==========================
// UPDATE / DELETE PERMISSION
// ==========================

const canManageActivities = (req, res, next) => {
  const allowedRoles = [
    'super_admin',
    'project_manager',
    'field_staff',
  ];

  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to modify activities',
    });
  }

  next();
};

// ==========================
// UPDATE ACTIVITY
// ==========================

router.put(
  '/:id',
  canManageActivities,
  activityController.updateActivity
);

// ==========================
// DELETE ACTIVITY
// ==========================

router.delete(
  '/:id',
  canManageActivities,
  activityController.deleteActivity
);

module.exports = router;