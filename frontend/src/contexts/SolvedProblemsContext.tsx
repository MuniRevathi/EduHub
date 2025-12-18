import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import userService from '../services/userService';

interface SolvedProblemsContextType {
  solvedProblems: Set<string>;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  toggleSolved: (problemId: string | number) => void;
  syncFromLeetCode: () => Promise<void>;
  isProblemSolved: (problemId: string | number) => boolean;
  totalSolved: number;
}

const SolvedProblemsContext = createContext<SolvedProblemsContextType | undefined>(undefined);

export const useSolvedProblems = () => {
  const context = useContext(SolvedProblemsContext);
  if (context === undefined) {
    throw new Error('useSolvedProblems must be used within a SolvedProblemsProvider');
  }
  return context;
};

interface SolvedProblemsProviderProps {
  children: ReactNode;
}

export const SolvedProblemsProvider = ({ children }: SolvedProblemsProviderProps) => {
  const { isAuthenticated } = useAuth();
  const [solvedProblems, setSolvedProblems] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('solvedProblems');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(() => {
    const saved = localStorage.getItem('lastLeetCodeSync');
    return saved ? new Date(saved) : null;
  });

  // Save to localStorage whenever solvedProblems changes
  useEffect(() => {
    localStorage.setItem('solvedProblems', JSON.stringify([...solvedProblems]));
  }, [solvedProblems]);

  // Auto-sync from user profile when authenticated
  useEffect(() => {
    const loadUserSolvedProblems = async () => {
      if (isAuthenticated) {
        try {
          const profile = await userService.getCurrentUserProfile();
          if (profile.solvedProblems && Array.isArray(profile.solvedProblems) && profile.solvedProblems.length > 0) {
            const problemsToAdd = profile.solvedProblems;
            setSolvedProblems(prev => {
              const newSet = new Set(prev);
              problemsToAdd.forEach((id: string) => newSet.add(String(id)));
              return newSet;
            });
          }
        } catch (error) {
          console.error('Failed to load user solved problems:', error);
        }
      }
    };

    loadUserSolvedProblems();
  }, [isAuthenticated]);

  // Auto-sync from LeetCode if session exists (once per session or every 30 minutes)
  useEffect(() => {
    const autoSync = async () => {
      if (!isAuthenticated) return;
      
      // Check if we should sync (last sync > 30 minutes ago or never synced)
      const shouldSync = !lastSyncTime || 
        (new Date().getTime() - lastSyncTime.getTime()) > 30 * 60 * 1000;
      
      if (shouldSync) {
        try {
          const profile = await userService.getCurrentUserProfile();
          // Only auto-sync if user has LeetCode session
          if (profile.leetcodeUsername) {
            await syncFromLeetCode();
          }
        } catch (error) {
          // Silently fail auto-sync
          console.log('Auto-sync skipped:', error);
        }
      }
    };

    // Delay auto-sync to not block initial load
    const timer = setTimeout(autoSync, 2000);
    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  // Sync solved problems from LeetCode
  const syncFromLeetCode = useCallback(async () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    try {
      const response = await userService.syncLeetCodeProblems();
      
      if (response.success && response.data?.solvedIds) {
        setSolvedProblems(prev => {
          const newSet = new Set(prev);
          response.data.solvedIds.forEach((id: string) => newSet.add(String(id)));
          return newSet;
        });
        
        setLastSyncTime(new Date());
        localStorage.setItem('lastLeetCodeSync', new Date().toISOString());
      }
    } catch (error) {
      console.error('Failed to sync from LeetCode:', error);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing]);

  // Toggle solved status for a problem
  const toggleSolved = useCallback((problemId: string | number) => {
    const id = String(problemId);
    setSolvedProblems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });

    // Also update on server if authenticated
    if (isAuthenticated) {
      const id = String(problemId);
      const isCurrentlySolved = solvedProblems.has(id);
      userService.updateSolvedProblems(id, isCurrentlySolved ? 'remove' : 'add')
        .catch(err => console.error('Failed to update server:', err));
    }
  }, [isAuthenticated, solvedProblems]);

  // Check if a problem is solved
  const isProblemSolved = useCallback((problemId: string | number): boolean => {
    return solvedProblems.has(String(problemId));
  }, [solvedProblems]);

  const value: SolvedProblemsContextType = {
    solvedProblems,
    isSyncing,
    lastSyncTime,
    toggleSolved,
    syncFromLeetCode,
    isProblemSolved,
    totalSolved: solvedProblems.size
  };

  return (
    <SolvedProblemsContext.Provider value={value}>
      {children}
    </SolvedProblemsContext.Provider>
  );
};

