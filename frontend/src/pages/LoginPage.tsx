import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Code2, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login({
        username: formData.username,
        password: formData.password
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] flex items-center justify-center">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gradient">EduHub</span>
              <span className="text-xs text-[var(--text-muted)] ml-2">PREMIUM</span>
            </div>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-[var(--text-secondary)]">
              Sign in to continue your DSA journey
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[var(--accent-red)]/10 border border-[var(--accent-red)]/30 text-[var(--accent-red)] text-sm animate-fade-in">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Username or Email
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="input-premium"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-premium pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[var(--border-secondary)] text-[var(--primary-500)] focus:ring-[var(--primary-500)]"
                />
                <span className="text-sm text-[var(--text-secondary)]">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-[var(--primary-400)] hover:text-[var(--primary-300)]">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border-primary)]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[var(--bg-primary)] text-[var(--text-muted)]">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[var(--border-primary)] hover:border-[var(--border-secondary)] hover:bg-[var(--bg-tertiary)] transition-all">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-medium">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[var(--border-primary)] hover:border-[var(--border-secondary)] hover:bg-[var(--bg-tertiary)] transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="text-sm font-medium">GitHub</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center mt-8 text-[var(--text-secondary)]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[var(--primary-400)] font-medium hover:text-[var(--primary-300)]">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-20 w-72 h-72 bg-[var(--primary-500)]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-[var(--accent-purple)]/20 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-md px-8">
          <div className="text-8xl mb-8">🚀</div>
          <h2 className="text-3xl font-bold mb-4">Master DSA, Land Your Dream Job</h2>
          <p className="text-[var(--text-secondary)] mb-8">
            Join thousands of developers who have successfully cracked FAANG interviews using our curated problems and patterns.
          </p>
          <div className="flex items-center justify-center gap-8">
            <div>
              <div className="text-3xl font-bold text-gradient">3000+</div>
              <div className="text-sm text-[var(--text-muted)]">Problems</div>
            </div>
            <div className="w-px h-12 bg-[var(--border-primary)]" />
            <div>
              <div className="text-3xl font-bold text-gradient">100+</div>
              <div className="text-sm text-[var(--text-muted)]">Companies</div>
            </div>
            <div className="w-px h-12 bg-[var(--border-primary)]" />
            <div>
              <div className="text-3xl font-bold text-gradient">40+</div>
              <div className="text-sm text-[var(--text-muted)]">Patterns</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
