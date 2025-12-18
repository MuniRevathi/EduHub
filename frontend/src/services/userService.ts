import apiClient from './apiClient';
import type { User, AuthUser, LoginRequest, RegisterRequest } from '../types';
import { BehaviorSubject } from 'rxjs';

class UserService {
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(
    JSON.parse(localStorage.getItem('currentUser') || 'null')
  );

  get currentUser() {
    return this.currentUserSubject.asObservable();
  }

  get currentUserValue() {
    return this.currentUserSubject.value;
  }

  // Login
  async login(loginRequest: LoginRequest): Promise<AuthUser> {
    try {
      const response = await apiClient.post('/api/auth/login', loginRequest);
      const authUser: AuthUser = response.data;
      
      // Store token and user info
      localStorage.setItem('accessToken', authUser.token);
      localStorage.setItem('currentUser', JSON.stringify(authUser));
      
      this.currentUserSubject.next(authUser);
      return authUser;
    } catch (error) {
      throw error;
    }
  }

  // Register - Direct registration (auto-login)
  async register(registerRequest: RegisterRequest): Promise<AuthUser> {
    try {
      const response = await apiClient.post('/api/auth/register', registerRequest);
      const authUser: AuthUser = {
        id: response.data.user.id,
        firstName: response.data.user.firstName,
        lastName: response.data.user.lastName,
        username: response.data.user.username,
        email: response.data.user.email,
        role: response.data.user.role,
        token: response.data.token
      };
      
      // Auto-login after registration
      localStorage.setItem('accessToken', authUser.token);
      localStorage.setItem('currentUser', JSON.stringify(authUser));
      this.currentUserSubject.next(authUser);
      
      return authUser;
    } catch (error) {
      throw error;
    }
  }

  // Register - Step 2: Verify OTP
  async verifyOTP(email: string, otp: string): Promise<AuthUser> {
    try {
      const response = await apiClient.post('/api/auth/verify-otp', { email, otp });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Resend OTP
  async resendOTP(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post('/api/auth/resend-otp', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Logout
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  // Get current user profile
  async getCurrentUserProfile(): Promise<User> {
    try {
      const response = await apiClient.get('/api/users/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update profile
  async updateProfile(userData: Partial<User>): Promise<{ success: boolean; user: User }> {
    try {
      const response = await apiClient.put('/api/users/profile', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Change password
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    try {
      await apiClient.post('/api/users/change-password', {
        oldPassword,
        newPassword
      });
    } catch (error) {
      throw error;
    }
  }

  // Forgot password
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post('/api/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Reset password
  async resetPassword(email: string, otp: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post('/api/auth/reset-password', { email, otp, newPassword });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Connect LeetCode
  async connectLeetCode(leetcodeUsername: string, leetcodeSession?: string): Promise<any> {
    try {
      const response = await apiClient.post('/api/users/connect-leetcode', { 
        leetcodeUsername, 
        leetcodeSession 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Disconnect LeetCode
  async disconnectLeetCode(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post('/api/users/disconnect-leetcode');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get LeetCode stats
  async getLeetCodeStats(username: string): Promise<any> {
    try {
      const response = await apiClient.get(`/api/leetcode/stats/${username}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Validate LeetCode session
  async validateLeetCodeSession(session: string): Promise<any> {
    try {
      const response = await apiClient.post('/api/leetcode/validate-session', { session });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Sync solved problems from LeetCode
  async syncLeetCodeProblems(): Promise<any> {
    try {
      const response = await apiClient.post('/api/leetcode/sync');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update solved problems
  async updateSolvedProblems(problemId: string, action: 'add' | 'remove'): Promise<any> {
    try {
      const response = await apiClient.post('/api/users/solved-problems', { problemId, action });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get public profile
  async getPublicProfile(username: string): Promise<any> {
    try {
      const response = await apiClient.get(`/api/users/${username}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
