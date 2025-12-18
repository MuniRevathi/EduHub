import dotenv from 'dotenv';

dotenv.config();

console.log('📧 Email service disabled - OTP verification skipped');

// Generate OTP (kept for future use)
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP Email - Disabled
export const sendOTPEmail = async (to, otp) => {
  console.log(`📧 [DISABLED] OTP for ${to}: ${otp}`);
  return { success: true, disabled: true };
};

// Send Password Reset Email - Disabled
export const sendPasswordResetEmail = async (to, otp) => {
  console.log(`📧 [DISABLED] Password Reset OTP for ${to}: ${otp}`);
  return { success: true, disabled: true };
};
