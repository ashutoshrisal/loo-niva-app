const express = require('express');

const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(
  authenticate,
  authorize(
    'super_admin',
    'project_manager',
    'field_staff'
  )
);
const studentController = require('../controllers/studentController');

router.get('/', studentController.getStudents);
router.use(
  authenticate,
  authorize(
    'super_admin',
    'project_manager',
    'field_staff'
  )
);
router.get('/:id', studentController.getStudent);

router.post('/', studentController.createStudent);

router.put('/:id', studentController.updateStudent);

router.delete('/:id', studentController.deleteStudent);

module.exports = router;