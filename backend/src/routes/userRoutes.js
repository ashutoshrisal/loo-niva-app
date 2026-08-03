const express = require('express');

const {
  authenticate,
  authorize,
} = require('../middleware/auth');

const {
  listUsers,
  updateUser,
  deactivateUser,
  getMyProfile,
  updateMyProfile,
} = require('../controllers/userController');

const router = express.Router();


// ==========================================
// CURRENT USER PROFILE
// ==========================================

// Any authenticated user can view their own profile
router.get('/me', authenticate, getMyProfile);

// Any authenticated user can update their own profile
router.put('/me', authenticate, updateMyProfile);


// ==========================================
// USER MANAGEMENT
// SUPER ADMIN ONLY
// ==========================================

router.use(authenticate, authorize('super_admin'));

router.get('/', listUsers);

router.put('/:id', updateUser);

router.delete('/:id', deactivateUser);


module.exports = router;