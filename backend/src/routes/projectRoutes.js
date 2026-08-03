const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const {
  listProjects, getProject, createProject, updateProject, deleteProject, assignStaff,
} = require('../controllers/projectController');

const router = express.Router();

router.use(authenticate); // every project route requires login

router.get('/', listProjects);
router.get('/:id', getProject);
router.post('/', authorize('super_admin', 'project_manager'), createProject);
router.put('/:id', authorize('super_admin', 'project_manager'), updateProject);
router.delete('/:id', authorize('super_admin'), deleteProject);
router.post('/:id/staff', authorize('super_admin', 'project_manager'), assignStaff);

module.exports = router;
