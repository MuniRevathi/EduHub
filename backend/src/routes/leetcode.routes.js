import express from 'express';
import { 
  syncSolvedProblems, 
  getLeetCodeStats,
  validateLeetCodeSession
} from '../controllers/leetcode.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Sync solved problems from LeetCode
router.post('/sync', authenticateToken, syncSolvedProblems);

// Get LeetCode stats for a username
router.get('/stats/:username', getLeetCodeStats);

// Validate LeetCode session
router.post('/validate-session', authenticateToken, validateLeetCodeSession);

export default router;

