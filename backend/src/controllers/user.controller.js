import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { fetchUserStats } from '../services/leetcode.service.js';

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -otp -otpExpires -leetcodeSession');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile.' });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      bio, 
      college, 
      location, 
      website,
      socialLinks,
      leetcodeUsername
    } = req.body;

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Update fields if provided
    if (firstName) user.firstName = firstName.trim();
    if (lastName) user.lastName = lastName.trim();
    if (bio !== undefined) user.bio = bio.trim();
    if (college !== undefined) user.college = college.trim();
    if (location !== undefined) user.location = location.trim();
    if (website !== undefined) user.website = website.trim();
    if (leetcodeUsername !== undefined) user.leetcodeUsername = leetcodeUsername.trim();
    
    if (socialLinks) {
      user.socialLinks = {
        github: socialLinks.github || user.socialLinks?.github || '',
        linkedin: socialLinks.linkedin || user.socialLinks?.linkedin || '',
        twitter: socialLinks.twitter || user.socialLinks?.twitter || ''
      };
    }

    await user.save();

    // Return updated user without sensitive fields
    const updatedUser = await User.findById(user._id).select('-password -otp -otpExpires -leetcodeSession');
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Old password and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters.' });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Verify old password
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }

    // Hash and save new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password.' });
  }
};

// Update avatar
export const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).json({ error: 'Avatar URL is required.' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true }
    ).select('-password -otp -otpExpires -leetcodeSession');

    res.status(200).json({
      success: true,
      message: 'Avatar updated successfully.',
      user
    });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({ error: 'Failed to update avatar.' });
  }
};

// Get public profile
export const getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username: username.toLowerCase() })
      .select('firstName lastName username avatar bio college location website socialLinks leetcodeUsername solvedProblems streak createdAt');

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Get LeetCode stats if username is set
    let leetcodeStats = null;
    if (user.leetcodeUsername) {
      try {
        leetcodeStats = await fetchUserStats(user.leetcodeUsername);
      } catch (e) {
        // Silently fail if LeetCode stats can't be fetched
        console.error('Failed to fetch LeetCode stats:', e);
      }
    }

    res.status(200).json({
      user,
      leetcodeStats
    });
  } catch (error) {
    console.error('Get public profile error:', error);
    res.status(500).json({ error: 'Failed to get profile.' });
  }
};

// Update solved problems
export const updateSolvedProblems = async (req, res) => {
  try {
    const { problemId, action } = req.body;

    if (!problemId || !action) {
      return res.status(400).json({ error: 'Problem ID and action are required.' });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (action === 'add') {
      if (!user.solvedProblems.includes(problemId)) {
        user.solvedProblems.push(problemId);
      }
    } else if (action === 'remove') {
      user.solvedProblems = user.solvedProblems.filter(id => id !== problemId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      solvedProblems: user.solvedProblems
    });
  } catch (error) {
    console.error('Update solved problems error:', error);
    res.status(500).json({ error: 'Failed to update solved problems.' });
  }
};

// Connect LeetCode account
export const connectLeetCode = async (req, res) => {
  try {
    const { leetcodeUsername, leetcodeSession } = req.body;

    if (!leetcodeUsername) {
      return res.status(400).json({ error: 'LeetCode username is required.' });
    }

    // Verify the username exists
    try {
      await fetchUserStats(leetcodeUsername);
    } catch (e) {
      return res.status(400).json({ error: 'LeetCode username not found.' });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    user.leetcodeUsername = leetcodeUsername;
    if (leetcodeSession) {
      user.leetcodeSession = leetcodeSession;
    }

    await user.save();

    // Get LeetCode stats
    const leetcodeStats = await fetchUserStats(leetcodeUsername);

    res.status(200).json({
      success: true,
      message: 'LeetCode account connected successfully.',
      leetcodeStats
    });
  } catch (error) {
    console.error('Connect LeetCode error:', error);
    res.status(500).json({ error: 'Failed to connect LeetCode account.' });
  }
};

// Disconnect LeetCode account
export const disconnectLeetCode = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    user.leetcodeUsername = '';
    user.leetcodeSession = '';

    await user.save();

    res.status(200).json({
      success: true,
      message: 'LeetCode account disconnected successfully.'
    });
  } catch (error) {
    console.error('Disconnect LeetCode error:', error);
    res.status(500).json({ error: 'Failed to disconnect LeetCode account.' });
  }
};

