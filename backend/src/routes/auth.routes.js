import express from 'express';
import { 
  register, 
  verifyOTP, 
  resendOTP, 
  login, 
  getCurrentUser,
  forgotPassword,
  resetPassword
} from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Registration flow
router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

// Login
router.post('/login', login);

// Get current user
router.get('/me', authenticateToken, getCurrentUser);

// Password reset
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;

