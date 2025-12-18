import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser, LoginRequest, RegisterRequest } from '../types';
import userService from '../services/userService';

interface AuthContextType {
  user: AuthUser | null;
  login: (loginRequest: LoginRequest) => Promise<void>;
  register: (registerRequest: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to current user changes
    const subscription = userService.currentUser.subscribe((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (loginRequest: LoginRequest): Promise<void> => {
    try {
      setLoading(true);
      const authUser = await userService.login(loginRequest);
      setUser(authUser);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (registerRequest: RegisterRequest): Promise<void> => {
    try {
      setLoading(true);
      const authUser = await userService.register(registerRequest);
      setUser(authUser);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    userService.logout();
    setUser(null);
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const profile = await userService.getCurrentUserProfile();
      const currentUser = userService.currentUserValue;
      if (currentUser) {
        const updatedUser: AuthUser = {
          ...currentUser,
          firstName: profile.firstName,
          lastName: profile.lastName,
          avatar: profile.avatar,
          streak: profile.streak
        };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
