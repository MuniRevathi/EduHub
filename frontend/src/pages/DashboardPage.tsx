import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSolvedProblems } from '../contexts/SolvedProblemsContext';
import { 
  Target, 
  TrendingUp, 
  ChevronRight,
  Flame,
  BookOpen,
  Clock,
  BarChart3,
  CheckCircle2,
  RefreshCw,
  Award
} from 'lucide-react';
import { problems, patterns, getProblemStats } from '../data';

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { solvedProblems, isProblemSolved, isSyncing, syncFromLeetCode, totalSolved } = useSolvedProblems();
  const stats = getProblemStats();

  // Calculate user stats
  const userStats = useMemo(() => {
    const solved = [...solvedProblems];
    const solvedDetails = solved.map(id => problems.find(p => p.id === id)).filter(Boolean);
    
    // Count patterns solved (unique patterns that have at least one problem solved)
    const patternsSolvedCount = patterns.reduce((count, pattern) => {
      const hasAnySolved = pattern.subpatterns.some(sub => 
        sub.problems.some(p => isProblemSolved(p.id))
      );
      return hasAnySolved ? count + 1 : count;
    }, 0);
    
    return {
      totalSolved: totalSolved,
      easySolved: solvedDetails.filter(p => p?.difficulty === 'Easy').length,
      mediumSolved: solvedDetails.filter(p => p?.difficulty === 'Medium').length,
      hardSolved: solvedDetails.filter(p => p?.difficulty === 'Hard').length,
      patternsSolved: patternsSolvedCount,
      streak: Math.floor(Math.random() * 30) + 1, // Placeholder streak
    };
  }, [solvedProblems, isProblemSolved, totalSolved]);

  // Calculate progress percentages
  const progressData = {
    easy: stats.easy > 0 ? (userStats.easySolved / stats.easy) * 100 : 0,
    medium: stats.medium > 0 ? (userStats.mediumSolved / stats.medium) * 100 : 0,
    hard: stats.hard > 0 ? (userStats.hardSolved / stats.hard) * 100 : 0,
    overall: stats.totalProblems > 0 ? (userStats.totalSolved / stats.totalProblems) * 100 : 0,
  };

  // Recent activity (mock data for now)
  const recentActivity = [
    { type: 'solved', title: 'Two Sum', difficulty: 'Easy', time: '2 hours ago' },
    { type: 'solved', title: 'Add Two Numbers', difficulty: 'Medium', time: '5 hours ago' },
    { type: 'solved', title: 'Longest Substring', difficulty: 'Medium', time: '1 day ago' },
    { type: 'solved', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', time: '2 days ago' },
  ];

  // Recommended problems (random selection)
  const recommendedProblems = useMemo(() => {
    const unsolved = problems.filter(p => !isProblemSolved(p.id));
    const shuffled = [...unsolved].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  }, [isProblemSolved]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-2">Please Login</h2>
          <p className="text-[var(--text-secondary)] mb-6">
            You need to be logged in to view your dashboard
          </p>
          <Link to="/login" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container-premium">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.firstName || 'Coder'}! 👋
            </h1>
            <p className="text-[var(--text-secondary)]">
              Track your progress and keep up the great work
            </p>
          </div>
          <button
            onClick={() => syncFromLeetCode()}
            disabled={isSyncing}
            className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent-yellow)]/10 border border-[var(--accent-yellow)]/30 text-[var(--accent-yellow)] font-semibold hover:bg-[var(--accent-yellow)]/20 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync LeetCode'}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--primary-500)]/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-[var(--primary-400)]" />
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-[var(--accent-green)]/10 text-[var(--accent-green)]">
                +{userStats.totalSolved}
              </span>
            </div>
            <div className="text-3xl font-bold mb-1">{userStats.totalSolved}</div>
            <div className="text-sm text-[var(--text-muted)]">Problems Solved</div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-yellow)]/10 flex items-center justify-center">
                <Flame className="w-6 h-6 text-[var(--accent-yellow)]" />
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-[var(--accent-yellow)]/10 text-[var(--accent-yellow)]">
                🔥
              </span>
            </div>
            <div className="text-3xl font-bold mb-1">{userStats.streak}</div>
            <div className="text-sm text-[var(--text-muted)]">Day Streak</div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-purple)]/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-[var(--accent-purple)]" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{userStats.patternsSolved}</div>
            <div className="text-sm text-[var(--text-muted)]">Patterns Learned</div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-blue)]/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-[var(--accent-blue)]" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {Math.round(progressData.overall)}%
            </div>
            <div className="text-sm text-[var(--text-muted)]">Overall Progress</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Progress & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress by Difficulty */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[var(--primary-400)]" />
                Progress by Difficulty
              </h3>

              <div className="space-y-6">
                {/* Easy */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[var(--accent-green)]" />
                      <span className="text-sm font-medium">Easy</span>
                    </div>
                    <span className="text-sm text-[var(--text-muted)]">
                      {userStats.easySolved} / {stats.easy}
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-[var(--accent-green)] transition-all duration-500"
                      style={{ width: `${progressData.easy}%` }}
                    />
                  </div>
                </div>

                {/* Medium */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[var(--accent-yellow)]" />
                      <span className="text-sm font-medium">Medium</span>
                    </div>
                    <span className="text-sm text-[var(--text-muted)]">
                      {userStats.mediumSolved} / {stats.medium}
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-[var(--accent-yellow)] transition-all duration-500"
                      style={{ width: `${progressData.medium}%` }}
                    />
                  </div>
                </div>

                {/* Hard */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[var(--accent-red)]" />
                      <span className="text-sm font-medium">Hard</span>
                    </div>
                    <span className="text-sm text-[var(--text-muted)]">
                      {userStats.hardSolved} / {stats.hard}
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-[var(--accent-red)] transition-all duration-500"
                      style={{ width: `${progressData.hard}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[var(--primary-400)]" />
                Recent Activity
              </h3>

              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-card-hover)] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--accent-green)]/10 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-[var(--accent-green)]" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{activity.title}</div>
                        <div className="text-xs text-[var(--text-muted)]">{activity.time}</div>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      activity.difficulty === 'Easy' ? 'badge-easy' :
                      activity.difficulty === 'Medium' ? 'badge-medium' :
                      'badge-hard'
                    }`}>
                      {activity.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Recommendations & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link 
                  to="/problems"
                  className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-card-hover)] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--primary-500)]/10 flex items-center justify-center">
                      <Target className="w-5 h-5 text-[var(--primary-400)]" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Company Problems</div>
                      <div className="text-xs text-[var(--text-muted)]">Practice by company</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--primary-400)] transition-colors" />
                </Link>

                <Link 
                  to="/patterns"
                  className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-card-hover)] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--accent-purple)]/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-[var(--accent-purple)]" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Pattern Wise</div>
                      <div className="text-xs text-[var(--text-muted)]">Learn patterns</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--primary-400)] transition-colors" />
                </Link>
              </div>
            </div>

            {/* Recommended Problems */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[var(--primary-400)]" />
                Recommended
              </h3>
              <div className="space-y-3">
                {recommendedProblems.map((problem) => (
                  <a
                    key={problem.id}
                    href={problem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-card-hover)] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{problem.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          problem.difficulty === 'Easy' ? 'badge-easy' :
                          problem.difficulty === 'Medium' ? 'badge-medium' :
                          'badge-hard'
                        }`}>
                          {problem.difficulty}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>

            {/* Motivational Card */}
            <div className="card p-6 bg-gradient-to-br from-[var(--primary-500)]/20 to-[var(--accent-purple)]/20 border-[var(--primary-500)]/30">
              <div className="text-4xl mb-3">💪</div>
              <h3 className="font-semibold mb-2">Keep Going!</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                You're making great progress. Consistency is key to mastering DSA. Keep solving problems daily!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
