import express from 'express';
import { 
  getProfile, 
  updateProfile, 
  changePassword,
  updateAvatar,
  getPublicProfile,
  updateSolvedProblems,
  connectLeetCode,
  disconnectLeetCode
} from '../controllers/user.controller.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Profile routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.post('/change-password', authenticateToken, changePassword);
router.put('/avatar', authenticateToken, updateAvatar);

// Public profile
router.get('/:username', optionalAuth, getPublicProfile);

// Solved problems tracking
router.post('/solved-problems', authenticateToken, updateSolvedProblems);

// LeetCode connection
router.post('/connect-leetcode', authenticateToken, connectLeetCode);
router.post('/disconnect-leetcode', authenticateToken, disconnectLeetCode);

export default router;

