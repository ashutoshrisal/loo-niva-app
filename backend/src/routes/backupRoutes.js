const express = require('express');

const {
  authenticate,
  authorize,
} = require('../middleware/auth');

const {
  backupDatabase,
} = require('../controllers/backupController');

const router = express.Router();

// Only authenticated super admins
router.use(
  authenticate,
  authorize('super_admin')
);

// Download PostgreSQL backup
router.get(
  '/database',
  backupDatabase
);

module.exports = router;