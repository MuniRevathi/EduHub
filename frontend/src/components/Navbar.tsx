import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, Code2, User, LogOut, ChevronDown, Settings } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { path: '/', label: 'Home', mobileLabel: 'Home' },
    { path: '/problems', label: 'Companies', mobileLabel: 'Problems' },
    { path: '/patterns', label: 'Patterns', mobileLabel: 'Patterns' },
    { path: '/resources', label: 'Resources', mobileLabel: 'Resources' },
    { path: '/dashboard', label: 'Dashboard', mobileLabel: 'Dashboard', requiresAuth: true },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--border-primary)]">
      <div className="container-premium">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-[var(--primary-500)] blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gradient">EduHub</span>
              <span className="text-[10px] text-[var(--text-muted)] -mt-1 tracking-wider">PREMIUM DSA</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.requiresAuth && !isAuthenticated) return null;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 xl:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                    isActive(link.path)
                      ? 'bg-[var(--primary-500)]/10 text-[var(--primary-400)] border border-[var(--primary-500)]/30'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Auth Section */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] hover:border-[var(--border-secondary)] transition-all duration-300 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-purple)] flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {user?.firstName || 'User'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl shadow-premium animate-fade-in">
                    <div className="px-4 py-2 border-b border-[var(--border-primary)]">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{user?.email}</p>
                      <p className="text-xs text-[var(--text-muted)]">{user?.role}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Profile Settings
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[var(--accent-red)] hover:bg-[var(--bg-tertiary)] transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm cursor-pointer"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] animate-fade-in">
          <div className="container-premium py-4 space-y-2">
            {navLinks.map((link) => {
              if (link.requiresAuth && !isAuthenticated) return null;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                    isActive(link.path)
                      ? 'bg-[var(--primary-500)]/10 text-[var(--primary-400)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                  }`}
                >
                  {link.mobileLabel || link.label}
                </Link>
              );
            })}
            
            <div className="pt-4 border-t border-[var(--border-primary)] space-y-2">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 rounded-lg text-sm font-medium text-[var(--accent-red)] hover:bg-[var(--bg-tertiary)] transition-colors text-left"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg text-sm font-medium text-center btn-primary"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
