import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Code2, ArrowRight, Loader2, RefreshCw, Mail, CheckCircle } from 'lucide-react';
import userService from '../services/userService';

const VerifyOTPPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Redirect if no email
    if (!email) {
      navigate('/register');
    }
    // Focus first input
    inputRefs.current[0]?.focus();
  }, [email, navigate]);

  useEffect(() => {
    // Countdown timer for resend
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pasteData = value.slice(0, 6).split('');
      const newOtp = [...otp];
      pasteData.forEach((char, i) => {
        if (index + i < 6 && /^\d$/.test(char)) {
          newOtp[index + i] = char;
        }
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + pasteData.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);

    try {
      await userService.verifyOTP(email, otpCode);
      setSuccess('Email verified successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login', { state: { message: 'Registration complete! Please login.' } });
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    setIsResending(true);
    setError('');

    try {
      await userService.resendOTP(email);
      setSuccess('A new verification code has been sent to your email.');
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] flex items-center justify-center shadow-lg">
            <Code2 className="w-7 h-7 text-white" />
          </div>
        </Link>

        {/* Card */}
        <div className="card p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--primary-500)]/20 to-[var(--accent-purple)]/20 flex items-center justify-center">
              <Mail className="w-10 h-10 text-[var(--primary-400)]" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Verify Your Email</h1>
            <p className="text-[var(--text-secondary)]">
              We've sent a 6-digit verification code to
            </p>
            <p className="text-[var(--primary-400)] font-medium mt-1">{email}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[var(--accent-red)]/10 border border-[var(--accent-red)]/30 text-[var(--accent-red)] text-sm animate-fade-in">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 rounded-xl bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/30 text-[var(--accent-green)] text-sm animate-fade-in flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              {success}
            </div>
          )}

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-[var(--bg-tertiary)] border-2 border-[var(--border-primary)] focus:border-[var(--primary-500)] focus:outline-none transition-all"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.join('').length !== 6}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify Email
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Resend OTP */}
          <div className="mt-6 text-center">
            <p className="text-[var(--text-secondary)] text-sm mb-2">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResendOTP}
              disabled={isResending || resendTimer > 0}
              className={`inline-flex items-center gap-2 text-sm font-medium ${
                resendTimer > 0
                  ? 'text-[var(--text-muted)] cursor-not-allowed'
                  : 'text-[var(--primary-400)] hover:text-[var(--primary-300)] cursor-pointer'
              }`}
            >
              {isResending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : resendTimer > 0 ? (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Resend in {resendTimer}s
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Resend Code
                </>
              )}
            </button>
          </div>

          {/* Back to Register */}
          <div className="mt-6 pt-6 border-t border-[var(--border-primary)] text-center">
            <Link
              to="/register"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              ← Back to Registration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTPPage;

