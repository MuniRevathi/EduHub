import mongoose from 'mongoose';

// Temporary user for OTP verification before final registration
const tempUserSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: true 
  },
  lastName: { 
    type: String, 
    required: true 
  },
  username: {
    type: String,
    required: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  otp: { 
    type: String, 
    required: true 
  },
  otpExpires: { 
    type: Date, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    expires: 600 // Auto-delete after 10 minutes
  }
});

export default mongoose.model('TempUser', tempUserSchema);

