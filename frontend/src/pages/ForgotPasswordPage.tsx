import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Code2, ArrowRight, Loader2, Mail, ArrowLeft, CheckCircle, KeyRound } from 'lucide-react';
import userService from '../services/userService';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState<'email' | 'otp' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await userService.forgotPassword(email);
      setMessage('If an account exists with this email, you will receive a password reset code.');
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send reset code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await userService.resetPassword(email, otp, newPassword);
      setStep('success');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
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
          {step === 'email' && (
            <>
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--primary-500)]/20 to-[var(--accent-purple)]/20 flex items-center justify-center">
                  <Mail className="w-10 h-10 text-[var(--primary-400)]" />
                </div>
              </div>

              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Forgot Password?</h1>
                <p className="text-[var(--text-secondary)]">
                  No worries! Enter your email and we'll send you a reset code.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-[var(--accent-red)]/10 border border-[var(--accent-red)]/30 text-[var(--accent-red)] text-sm">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSendOTP} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-premium"
                    placeholder="Enter your email"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary flex items-center justify-center gap-2 py-3"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Reset Code
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Back to Login */}
              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>
              </div>
            </>
          )}

          {step === 'otp' && (
            <>
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--primary-500)]/20 to-[var(--accent-purple)]/20 flex items-center justify-center">
                  <KeyRound className="w-10 h-10 text-[var(--primary-400)]" />
                </div>
              </div>

              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
                <p className="text-[var(--text-secondary)]">
                  Enter the code sent to your email and your new password.
                </p>
              </div>

              {/* Message */}
              {message && (
                <div className="mb-6 p-4 rounded-xl bg-[var(--accent-blue)]/10 border border-[var(--accent-blue)]/30 text-[var(--accent-blue)] text-sm">
                  {message}
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-[var(--accent-red)]/10 border border-[var(--accent-red)]/30 text-[var(--accent-red)] text-sm">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="input-premium"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-premium"
                    placeholder="Min 6 characters"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-premium"
                    placeholder="Confirm new password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary flex items-center justify-center gap-2 py-3 mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Back */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setStep('email')}
                  className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Use different email
                </button>
              </div>
            </>
          )}

          {step === 'success' && (
            <>
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-[var(--accent-green)]/20 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-[var(--accent-green)]" />
                </div>
              </div>

              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Password Reset!</h1>
                <p className="text-[var(--text-secondary)]">
                  Your password has been successfully reset. You can now sign in with your new password.
                </p>
              </div>

              <Link
                to="/login"
                className="w-full btn-primary flex items-center justify-center gap-2 py-3"
              >
                Go to Sign In
                <ArrowRight className="w-5 h-5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

