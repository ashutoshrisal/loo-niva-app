const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { listEvents, createEvent, deleteEvent } = require('../controllers/eventController');

const router = express.Router();
router.use(authenticate);

router.get('/', listEvents);
router.post('/', authorize('super_admin', 'project_manager', 'field_staff'), createEvent);
router.delete('/:id', authorize('super_admin', 'project_manager'), deleteEvent);

module.exports = router;
