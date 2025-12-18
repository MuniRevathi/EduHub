import bcrypt from 'bcrypt';
import User from '../models/User.js';
import TempUser from '../models/TempUser.js';
import { generateToken } from '../middleware/auth.middleware.js';
import { sendOTPEmail, generateOTP } from '../services/email.service.js';

// Register - Direct registration (OTP skipped for now)
export const register = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(409).json({ error: 'Email is already registered.' });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username: username.toLowerCase() });
    if (existingUsername) {
      return res.status(409).json({ error: 'Username is already taken.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user directly (skipping OTP for now)
    const user = new User({
      firstName,
      lastName,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'STUDENT',
      enabled: true
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

// Register - Step 2: Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required.' });
    }

    // Find temp user
    const tempUser = await TempUser.findOne({ email: email.toLowerCase() });

    if (!tempUser) {
      return res.status(400).json({ error: 'Registration session expired. Please register again.' });
    }

    // Verify OTP
    if (tempUser.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP. Please try again.' });
    }

    // Check if OTP expired
    if (tempUser.otpExpires < new Date()) {
      await TempUser.deleteOne({ email: email.toLowerCase() });
      return res.status(400).json({ error: 'OTP has expired. Please register again.' });
    }

    // Create actual user
    const user = new User({
      firstName: tempUser.firstName,
      lastName: tempUser.lastName,
      username: tempUser.username,
      email: tempUser.email,
      password: tempUser.password,
      role: 'STUDENT',
      enabled: true
    });

    await user.save();

    // Delete temp user
    await TempUser.deleteOne({ email: email.toLowerCase() });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'Verification failed. Please try again.' });
  }
};

// Resend OTP
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const tempUser = await TempUser.findOne({ email: email.toLowerCase() });

    if (!tempUser) {
      return res.status(400).json({ error: 'Registration session not found. Please register again.' });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    tempUser.otp = otp;
    tempUser.otpExpires = otpExpires;
    await tempUser.save();

    // Send new OTP
    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.error('Email error:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'New OTP sent to your email.'
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ error: 'Failed to resend OTP.' });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username/Email and password are required.' });
    }

    // Find user by username or email
    const user = await User.findOne({
      $or: [
        { username: username.toLowerCase() },
        { email: username.toLowerCase() }
      ]
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    if (!user.enabled) {
      return res.status(403).json({ error: 'Account is disabled. Please contact support.' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Update streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastActive = new Date(user.lastActiveDate);
    lastActive.setHours(0, 0, 0, 0);
    
    const dayDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
    
    if (dayDiff === 1) {
      user.streak += 1;
    } else if (dayDiff > 1) {
      user.streak = 1;
    }
    
    user.lastActiveDate = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      role: user.role,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -otp -otpExpires -leetcodeSession');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Failed to get user data.' });
  }
};

// Forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if email exists
      return res.status(200).json({ 
        success: true, 
        message: 'If an account exists with this email, you will receive a password reset link.' 
      });
    }

    // Generate OTP for password reset
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.error('Email error:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'If an account exists with this email, you will receive a password reset code.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process request.' });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP, and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const user = await User.findOne({ 
      email: email.toLowerCase(),
      otp,
      otpExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired OTP.' });
    }

    // Update password
    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password.' });
  }
};

