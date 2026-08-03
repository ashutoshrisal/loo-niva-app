const express = require('express');
const { authenticate } = require('../middleware/auth');
const schoolController = require('../controllers/schoolController');

const router = express.Router();

router.use(authenticate);

// Get all schools
router.get('/', schoolController.getSchools);

// Get one school
router.get('/:id', schoolController.getSchool);

// Create school
router.post('/', schoolController.createSchool);

// Update school
router.put('/:id', schoolController.updateSchool);

// Delete school
router.delete('/:id', schoolController.deleteSchool);

module.exports = router;