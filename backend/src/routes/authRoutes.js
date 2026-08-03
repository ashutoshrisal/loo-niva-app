const express = require('express');
const rateLimit = require('express-rate-limit');

const {
  login,
  refresh,
  me,
  register,
  changePassword,
  updateProfile,
} = require('../controllers/authController');

const {
  authenticate,
  authorize,
} = require('../middleware/auth');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 10 : 1000,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again later.',
  },
});

// LOGIN
router.post('/login', loginLimiter, login);

// REFRESH TOKEN
router.post('/refresh', refresh);

// CURRENT USER
router.get('/me', authenticate, me);

// CHANGE PASSWORD
router.put('/change-password', authenticate, changePassword);
router.put(
  '/profile',
  authenticate,
  updateProfile
);

// REGISTER USER - SUPER ADMIN ONLY
router.post(
  '/register',
  authenticate,
  authorize('super_admin'),
  register
);

module.exports = router;