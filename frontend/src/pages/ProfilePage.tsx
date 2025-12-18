import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Mail, 
  MapPin, 
  Building2, 
  Globe, 
  Github, 
  Linkedin, 
  Twitter,
  Edit3,
  Save,
  X,
  Loader2,
  Code2,
  CheckCircle,
  Link as LinkIcon,
  Camera,
  Lock,
  RefreshCw,
  ExternalLink,
  Info,
  Key
} from 'lucide-react';
import userService from '../services/userService';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  bio: string;
  college: string;
  location: string;
  website: string;
  leetcodeUsername: string;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
  };
  avatar: string;
  streak: number;
  solvedProblems: string[];
}

interface LeetCodeStats {
  username: string;
  ranking: number;
  solved: {
    easy: number;
    medium: number;
    hard: number;
    total: number;
  };
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    bio: '',
    college: '',
    location: '',
    website: '',
    leetcodeUsername: '',
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: ''
    },
    avatar: '',
    streak: 0,
    solvedProblems: []
  });

  const [leetcodeStats, setLeetcodeStats] = useState<LeetCodeStats | null>(null);
  const [isConnectingLeetCode, setIsConnectingLeetCode] = useState(false);
  const [isSyncingLeetCode, setIsSyncingLeetCode] = useState(false);
  
  // LeetCode session for sync
  const [leetcodeSession, setLeetcodeSession] = useState('');
  const [showSessionInput, setShowSessionInput] = useState(false);
  
  // Password change
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [isAuthenticated, navigate]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getCurrentUserProfile();
      setProfileData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        username: data.username || '',
        bio: data.bio || '',
        college: data.college || '',
        location: data.location || '',
        website: data.website || '',
        leetcodeUsername: data.leetcodeUsername || '',
        socialLinks: {
          github: data.socialLinks?.github || '',
          linkedin: data.socialLinks?.linkedin || '',
          twitter: data.socialLinks?.twitter || ''
        },
        avatar: data.avatar || '',
        streak: data.streak || 0,
        solvedProblems: data.solvedProblems || []
      });

      // Fetch LeetCode stats if username is set
      if (data.leetcodeUsername) {
        fetchLeetCodeStats(data.leetcodeUsername);
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLeetCodeStats = async (username: string) => {
    try {
      const response = await userService.getLeetCodeStats(username);
      setLeetcodeStats(response.data);
    } catch (err) {
      console.error('Failed to fetch LeetCode stats:', err);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      await userService.updateProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        bio: profileData.bio,
        college: profileData.college,
        location: profileData.location,
        website: profileData.website,
        leetcodeUsername: profileData.leetcodeUsername,
        socialLinks: profileData.socialLinks
      });
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Fetch LeetCode stats if username changed
      if (profileData.leetcodeUsername) {
        fetchLeetCodeStats(profileData.leetcodeUsername);
      } else {
        setLeetcodeStats(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConnectLeetCode = async () => {
    if (!profileData.leetcodeUsername) {
      setError('Please enter your LeetCode username first');
      return;
    }

    setIsConnectingLeetCode(true);
    setError('');

    try {
      const response = await userService.connectLeetCode(profileData.leetcodeUsername);
      setLeetcodeStats(response.leetcodeStats);
      setSuccess('LeetCode account connected successfully!');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to connect LeetCode account. Make sure the username is correct.');
    } finally {
      setIsConnectingLeetCode(false);
    }
  };

  const handleSyncLeetCode = async () => {
    if (!leetcodeSession) {
      setError('Please enter your LEETCODE_SESSION cookie');
      return;
    }

    setIsSyncingLeetCode(true);
    setError('');

    try {
      // First validate and save the session
      await userService.validateLeetCodeSession(leetcodeSession);
      // Then sync problems
      const response = await userService.syncLeetCodeProblems();
      setSuccess(`Synced ${response.data?.totalSynced || 0} solved problems from LeetCode!`);
      setShowSessionInput(false);
      setLeetcodeSession('');
      // Refresh profile to get updated solved problems
      fetchProfile();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to sync. Make sure your session cookie is valid.');
    } finally {
      setIsSyncingLeetCode(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsChangingPassword(true);
    setError('');

    try {
      await userService.changePassword(passwordData.oldPassword, passwordData.newPassword);
      setSuccess('Password changed successfully!');
      setShowPasswordModal(false);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary-500)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Sticky Header */}
      <div className="sticky top-16 z-40 bg-[var(--bg-primary)] border-b border-[var(--border-primary)] py-4 mb-6">
        <div className="container-premium max-w-5xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Profile Settings</h1>
              <p className="text-[var(--text-secondary)] text-sm">Manage your account and preferences</p>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary flex items-center gap-2 self-start sm:self-auto"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn-primary flex items-center gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container-premium max-w-5xl">

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-[var(--accent-red)]/10 border border-[var(--accent-red)]/30 text-[var(--accent-red)] text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/30 text-[var(--accent-green)] text-sm flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {success}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card & LeetCode */}
          <div className="space-y-6">
            {/* Avatar & Basic Info */}
            <div className="card p-6 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-purple)] flex items-center justify-center text-3xl font-bold text-white">
                  {profileData.avatar ? (
                    <img src={profileData.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    `${profileData.firstName[0] || ''}${profileData.lastName[0] || ''}`.toUpperCase()
                  )}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--bg-card)] border border-[var(--border-primary)] flex items-center justify-center hover:bg-[var(--bg-tertiary)] transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <h2 className="text-xl font-bold">{profileData.firstName} {profileData.lastName}</h2>
              <p className="text-[var(--text-muted)]">@{profileData.username}</p>
              
              {/* Stats */}
              <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-[var(--border-primary)]">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--primary-400)]">{profileData.solvedProblems.length}</div>
                  <div className="text-xs text-[var(--text-muted)]">Solved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--accent-yellow)]">{profileData.streak}</div>
                  <div className="text-xs text-[var(--text-muted)]">Streak</div>
                </div>
              </div>
            </div>

            {/* LeetCode Integration Card */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-[var(--accent-yellow)]" />
                  <h3 className="font-semibold">LeetCode Integration</h3>
                </div>
                {leetcodeStats && (
                  <a 
                    href={`https://leetcode.com/${leetcodeStats.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--text-muted)] hover:text-[var(--primary-400)] transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              
              {leetcodeStats ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-secondary)]">Username</span>
                    <span className="text-[var(--primary-400)] font-medium">@{leetcodeStats.username}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-secondary)]">Ranking</span>
                    <span className="font-medium">#{leetcodeStats.ranking.toLocaleString()}</span>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[var(--border-primary)]">
                    <div className="text-center p-3 rounded-lg bg-[var(--accent-green)]/10">
                      <div className="text-lg font-bold text-[var(--accent-green)]">{leetcodeStats.solved.easy}</div>
                      <div className="text-xs text-[var(--text-muted)]">Easy</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-[var(--accent-yellow)]/10">
                      <div className="text-lg font-bold text-[var(--accent-yellow)]">{leetcodeStats.solved.medium}</div>
                      <div className="text-xs text-[var(--text-muted)]">Medium</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-[var(--accent-red)]/10">
                      <div className="text-lg font-bold text-[var(--accent-red)]">{leetcodeStats.solved.hard}</div>
                      <div className="text-xs text-[var(--text-muted)]">Hard</div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="text-center p-3 rounded-lg bg-[var(--primary-500)]/10 border border-[var(--primary-500)]/20">
                    <div className="text-2xl font-bold text-[var(--primary-400)]">{leetcodeStats.solved.total}</div>
                    <div className="text-xs text-[var(--text-muted)]">Total Solved</div>
                  </div>

                  {/* Sync Button */}
                  <button
                    onClick={() => setShowSessionInput(!showSessionInput)}
                    className="w-full btn-secondary flex items-center justify-center gap-2 text-sm"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Sync Solved Problems
                  </button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--accent-yellow)]/10 flex items-center justify-center">
                    <Code2 className="w-8 h-8 text-[var(--accent-yellow)]" />
                  </div>
                  <p className="text-[var(--text-muted)] text-sm mb-4">Connect your LeetCode account to track your progress</p>
                  
                  {profileData.leetcodeUsername ? (
                    <button
                      onClick={handleConnectLeetCode}
                      disabled={isConnectingLeetCode}
                      className="btn-primary text-sm flex items-center justify-center gap-2 mx-auto"
                    >
                      {isConnectingLeetCode ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <LinkIcon className="w-4 h-4" />
                      )}
                      Connect LeetCode
                    </button>
                  ) : (
                    <p className="text-xs text-[var(--text-muted)]">
                      Enter your LeetCode username in the form and save to connect
                    </p>
                  )}
                </div>
              )}

              {/* Session Input for Sync */}
              {showSessionInput && (
                <div className="mt-4 pt-4 border-t border-[var(--border-primary)] space-y-4">
                  <div className="p-3 rounded-lg bg-[var(--accent-blue)]/10 border border-[var(--accent-blue)]/20">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-[var(--accent-blue)] mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-[var(--text-secondary)]">
                        <p className="font-semibold text-[var(--accent-blue)] mb-1">How to get your session cookie:</p>
                        <ol className="list-decimal list-inside space-y-1">
                          <li>Log in at <a href="https://leetcode.com" target="_blank" rel="noopener noreferrer" className="text-[var(--primary-400)] hover:underline">leetcode.com</a></li>
                          <li>Open DevTools (F12 or Ctrl+Shift+I)</li>
                          <li>Go to Application → Cookies</li>
                          <li>Copy the <code className="px-1 py-0.5 bg-[var(--bg-tertiary)] rounded">LEETCODE_SESSION</code> value</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      <Key className="w-4 h-4 inline mr-1" />
                      LEETCODE_SESSION Cookie
                    </label>
                    <textarea
                      value={leetcodeSession}
                      onChange={(e) => setLeetcodeSession(e.target.value)}
                      placeholder="Paste your LEETCODE_SESSION cookie here..."
                      rows={3}
                      className="input-premium text-xs resize-none font-mono"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowSessionInput(false);
                        setLeetcodeSession('');
                      }}
                      className="flex-1 btn-secondary text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSyncLeetCode}
                      disabled={isSyncingLeetCode || !leetcodeSession}
                      className="flex-1 btn-primary text-sm flex items-center justify-center gap-2"
                    >
                      {isSyncingLeetCode ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                      Sync Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Edit Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="card p-6">
              <h3 className="font-semibold mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-[var(--primary-400)]" />
                Personal Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    disabled={!isEditing}
                    className="input-premium disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    disabled={!isEditing}
                    className="input-premium disabled:opacity-60"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      className="input-premium pl-12 disabled:opacity-60"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    disabled={!isEditing}
                    rows={3}
                    maxLength={500}
                    placeholder="Tell us about yourself..."
                    className="input-premium disabled:opacity-60 resize-none"
                  />
                  <div className="text-xs text-[var(--text-muted)] mt-1 text-right">
                    {profileData.bio.length}/500
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="card p-6">
              <h3 className="font-semibold mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[var(--primary-400)]" />
                Additional Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    College/University
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      value={profileData.college}
                      onChange={(e) => setProfileData({ ...profileData, college: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Your college"
                      className="input-premium pl-12 disabled:opacity-60"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      disabled={!isEditing}
                      placeholder="City, Country"
                      className="input-premium pl-12 disabled:opacity-60"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                    <input
                      type="url"
                      value={profileData.website}
                      onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                      disabled={!isEditing}
                      placeholder="https://yourwebsite.com"
                      className="input-premium pl-12 disabled:opacity-60"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    LeetCode Username
                  </label>
                  <div className="relative">
                    <Code2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      value={profileData.leetcodeUsername}
                      onChange={(e) => setProfileData({ ...profileData, leetcodeUsername: e.target.value })}
                      disabled={!isEditing}
                      placeholder="your_leetcode_username"
                      className="input-premium pl-12 disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="card p-6">
              <h3 className="font-semibold mb-6 flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-[var(--primary-400)]" />
                Social Links
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    GitHub
                  </label>
                  <div className="relative">
                    <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                    <input
                      type="url"
                      value={profileData.socialLinks.github}
                      onChange={(e) => setProfileData({ 
                        ...profileData, 
                        socialLinks: { ...profileData.socialLinks, github: e.target.value }
                      })}
                      disabled={!isEditing}
                      placeholder="https://github.com/username"
                      className="input-premium pl-12 disabled:opacity-60"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    LinkedIn
                  </label>
                  <div className="relative">
                    <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                    <input
                      type="url"
                      value={profileData.socialLinks.linkedin}
                      onChange={(e) => setProfileData({ 
                        ...profileData, 
                        socialLinks: { ...profileData.socialLinks, linkedin: e.target.value }
                      })}
                      disabled={!isEditing}
                      placeholder="https://linkedin.com/in/username"
                      className="input-premium pl-12 disabled:opacity-60"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Twitter
                  </label>
                  <div className="relative">
                    <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                    <input
                      type="url"
                      value={profileData.socialLinks.twitter}
                      onChange={(e) => setProfileData({ 
                        ...profileData, 
                        socialLinks: { ...profileData.socialLinks, twitter: e.target.value }
                      })}
                      disabled={!isEditing}
                      placeholder="https://twitter.com/username"
                      className="input-premium pl-12 disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="card p-6">
              <h3 className="font-semibold mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5 text-[var(--primary-400)]" />
                Security
              </h3>
              
              <button
                onClick={() => setShowPasswordModal(true)}
                className="btn-secondary"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="card p-6 w-full max-w-md animate-fade-in">
            <h3 className="text-xl font-bold mb-6">Change Password</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  className="input-premium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="input-premium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="input-premium"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                disabled={isChangingPassword}
                className="flex-1 btn-primary"
              >
                {isChangingPassword ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  'Change Password'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
