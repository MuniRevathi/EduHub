import User from '../models/User.js';
import { 
  fetchSolvedProblems, 
  fetchUserStats, 
  validateSession 
} from '../services/leetcode.service.js';

// Sync solved problems from LeetCode
export const syncSolvedProblems = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (!user.leetcodeSession) {
      return res.status(400).json({ 
        error: 'No LeetCode session found. Please connect your LeetCode account first.' 
      });
    }

    const result = await fetchSolvedProblems(user.leetcodeSession);
    
    // Update user's solved problems with IDs (for matching with local problems)
    // Store IDs as strings for consistency
    const existingSolved = new Set(user.solvedProblems);
    result.solvedIds.forEach(id => existingSolved.add(id));
    
    user.solvedProblems = Array.from(existingSolved);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Sync completed successfully.',
      data: {
        totalSynced: result.totalSolved,
        solvedIds: result.solvedIds,
        solvedProblems: user.solvedProblems,
        leetcodeTotal: result.totalProblems
      }
    });
  } catch (error) {
    console.error('Sync solved problems error:', error);
    res.status(500).json({ error: 'Failed to sync with LeetCode. Please check your session cookie.' });
  }
};

// Get LeetCode stats for a username
export const getLeetCodeStats = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ error: 'Username is required.' });
    }

    const stats = await fetchUserStats(username);
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get LeetCode stats error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch LeetCode stats.' });
  }
};

// Validate LeetCode session
export const validateLeetCodeSession = async (req, res) => {
  try {
    const { session } = req.body;

    if (!session) {
      return res.status(400).json({ error: 'Session cookie is required.' });
    }

    const result = await validateSession(session);
    
    if (result.valid) {
      // Save the session if valid
      const user = await User.findById(req.user._id);
      if (user) {
        user.leetcodeSession = session;
        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      valid: result.valid,
      username: result.userStatus
    });
  } catch (error) {
    console.error('Validate session error:', error);
    res.status(500).json({ error: 'Failed to validate session.' });
  }
};

