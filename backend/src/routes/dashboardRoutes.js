const express = require('express');
const router = express.Router();

const { authenticate } = require('../middleware/auth');
const dashboardController = require('../controllers/dashboardController');

router.use(authenticate);

router.get('/summary', dashboardController.summary);
router.get('/monthly-activity', dashboardController.monthlyActivity);
router.get('/analytics', dashboardController.analytics);
router.get('/stats', dashboardController.stats);

module.exports = router;