const express = require('express');

const {
  authenticate,
  authorize,
} = require('../middleware/auth');

const {
  getOrganizationSettings,
  updateOrganizationSettings,
} = require('../controllers/organizationController');

const router = express.Router();

// All organization settings require login
router.use(authenticate);

// Anyone logged in can view organization information
router.get('/', getOrganizationSettings);

// Only Super Admin can modify organization information
router.put(
  '/',
  authorize('super_admin'),
  updateOrganizationSettings
);

module.exports = router;