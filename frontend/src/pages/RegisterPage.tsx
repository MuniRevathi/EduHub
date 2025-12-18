import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Code2, Eye, EyeOff, ArrowRight, Loader2, Check } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      // Navigate to dashboard after successful registration
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
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

  const features = [
    'Access to 3000+ curated problems',
    'Company-wise question filtering',
    '40+ coding patterns',
    'Track your progress',
    'Premium solutions access'
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-[var(--primary-600)] to-[var(--primary-700)] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-30" />
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-md px-8 text-white">
          <div className="mb-8">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-6">
              <Code2 className="w-8 h-8" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Start Your Journey to Success</h2>
            <p className="text-white/80 text-lg">
              Join the community of developers mastering DSA and landing their dream jobs.
            </p>
          </div>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-white/90">{feature}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-white/10 backdrop-blur">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl">👨‍💻</div>
              <div>
                <div className="font-semibold">Rahul Kumar</div>
                <div className="text-sm text-white/70">SDE at Google</div>
              </div>
            </div>
            <p className="text-white/80 italic">
              "EduHub's pattern-based approach changed how I solve problems. The company-wise filtering was a game changer for my interview prep!"
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] flex items-center justify-center">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gradient">EduHub</span>
            </div>
          </Link>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Create an account</h1>
            <p className="text-[var(--text-secondary)]">
              Start your DSA journey today
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[var(--accent-red)]/10 border border-[var(--accent-red)]/30 text-[var(--accent-red)] text-sm animate-fade-in">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input-premium"
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input-premium"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="input-premium"
                placeholder="johndoe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-premium"
                placeholder="john@example.com"
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
                  placeholder="Min 6 characters"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-premium"
                placeholder="Confirm your password"
              />
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                required
                className="w-4 h-4 mt-0.5 rounded border-[var(--border-secondary)] text-[var(--primary-500)] focus:ring-[var(--primary-500)]"
              />
              <span className="text-sm text-[var(--text-secondary)]">
                I agree to the{' '}
                <a href="#" className="text-[var(--primary-400)] hover:text-[var(--primary-300)]">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-[var(--primary-400)] hover:text-[var(--primary-300)]">Privacy Policy</a>
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center mt-6 text-[var(--text-secondary)]">
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--primary-400)] font-medium hover:text-[var(--primary-300)]">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
