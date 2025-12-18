import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: true,
    trim: true
  },
  lastName: { 
    type: String, 
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  role: {
    type: String,
    enum: ['STUDENT', 'INSTRUCTOR', 'ADMIN'],
    default: 'STUDENT'
  },
  enabled: {
    type: Boolean,
    default: true
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: '',
    maxlength: 500
  },
  college: { 
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  // LeetCode Integration
  leetcodeUsername: { 
    type: String,
    default: ''
  },
  leetcodeSession: {
    type: String,
    default: ''
  },
  // Social Links
  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' }
  },
  // Problem Tracking
  solvedProblems: [{
    type: String // Problem IDs
  }],
  solvedPatterns: [{
    type: Number // Pattern IDs
  }],
  // Stats
  streak: {
    type: Number,
    default: 0
  },
  lastActiveDate: {
    type: Date,
    default: Date.now
  },
  // OTP for verification
  otp: { 
    type: String 
  },
  otpExpires: { 
    type: Date 
  }
}, {
  timestamps: true
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtuals are included in JSON
userSchema.set('toJSON', { virtuals: true });

export default mongoose.model('User', userSchema);

