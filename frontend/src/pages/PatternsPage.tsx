import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  ExternalLink, 
  Check,
  BookOpen,
  Target,
  Search,
  X,
  RefreshCw
} from 'lucide-react';
import { patterns, problems } from '../data';
import { useSolvedProblems } from '../contexts/SolvedProblemsContext';

const PatternsPage = () => {
  // Use global solved problems context
  const { isProblemSolved, toggleSolved, isSyncing, syncFromLeetCode } = useSolvedProblems();
  
  // Only one pattern can be expanded at a time (accordion behavior)
  const [expandedPattern, setExpandedPattern] = useState<number | null>(0);
  // Only one subpattern can be expanded at a time within a pattern
  const [expandedSubpattern, setExpandedSubpattern] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const togglePattern = (index: number) => {
    // Close if clicking same pattern, otherwise open new one (closes others automatically)
    setExpandedPattern(prev => prev === index ? null : index);
    // Reset subpattern when pattern changes
    setExpandedSubpattern(null);
  };

  const toggleSubpattern = (key: string) => {
    // Close if clicking same subpattern, otherwise open new one (closes others automatically)
    setExpandedSubpattern(prev => prev === key ? null : key);
  };

  const handleToggleSolved = (e: React.MouseEvent, problemId: number) => {
    e.stopPropagation();
    toggleSolved(problemId);
  };

  // Filter patterns based on search
  const filteredPatterns = patterns.map(pattern => ({
    ...pattern,
    subpatterns: pattern.subpatterns.map(sub => ({
      ...sub,
      problems: sub.problems.filter(p => 
        p.title.toLowerCase().includes(search.toLowerCase())
      )
    })).filter(sub => sub.problems.length > 0)
  })).filter(pattern => pattern.subpatterns.length > 0);

  // Calculate progress for each pattern
  const getPatternProgress = (patternIndex: number) => {
    const pattern = patterns[patternIndex];
    const totalProblems = pattern.subpatterns.reduce((acc, sub) => acc + sub.problems.length, 0);
    const solvedCount = pattern.subpatterns.reduce((acc, sub) => 
      acc + sub.problems.filter(p => isProblemSolved(p.id)).length, 0
    );
    return { total: totalProblems, solved: solvedCount };
  };

  // Get overall stats
  const totalProblems = patterns.reduce((acc, p) => 
    acc + p.subpatterns.reduce((a, s) => a + s.problems.length, 0), 0
  );
  // Count solved problems that are in the patterns
  const totalSolved = patterns.reduce((acc, p) => 
    acc + p.subpatterns.reduce((a, s) => 
      a + s.problems.filter(prob => isProblemSolved(prob.id)).length, 0
    ), 0
  );

  // Calculate stats by difficulty - lookup from main problems data
  const difficultyStats = patterns.reduce((stats, p) => {
    p.subpatterns.forEach(s => {
      s.problems.forEach(patternProb => {
        // Find the problem in main problems array to get difficulty
        const mainProblem = problems.find(mp => mp.id === String(patternProb.id));
        if (mainProblem) {
          const diff = mainProblem.difficulty;
          if (diff === 'Easy') {
            stats.totalEasy++;
            if (isProblemSolved(patternProb.id)) stats.solvedEasy++;
          } else if (diff === 'Medium') {
            stats.totalMedium++;
            if (isProblemSolved(patternProb.id)) stats.solvedMedium++;
          } else if (diff === 'Hard') {
            stats.totalHard++;
            if (isProblemSolved(patternProb.id)) stats.solvedHard++;
          }
        }
      });
    });
    return stats;
  }, { totalEasy: 0, totalMedium: 0, totalHard: 0, solvedEasy: 0, solvedMedium: 0, solvedHard: 0 });

  return (
    <div className="min-h-screen pt-[180px] sm:pt-[200px] pb-16 bg-[var(--bg-primary)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Pattern-Wise Problems</h1>
          <p className="text-base sm:text-lg lg:text-xl text-[var(--text-secondary)]">
            Master {patterns.length}+ coding patterns that cover 90% of interview questions.
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Circular Progress */}
            <div className="flex flex-col items-center">
              <div className="text-lg font-semibold mb-3 text-[var(--text-secondary)]">Your Progress</div>
              <div className="relative">
                <svg width="160" height="160" viewBox="0 0 160 160">
                  {/* Background circle */}
                  <circle cx="80" cy="80" r="65" stroke="var(--bg-tertiary)" strokeWidth="12" fill="none" />
                  {/* Progress arc */}
                  <circle 
                    cx="80" cy="80" r="65" 
                    stroke="var(--accent-green)" 
                    strokeWidth="12" 
                    fill="none"
                    strokeDasharray={`${(totalSolved / Math.max(totalProblems, 1)) * 408} 408`}
                    strokeLinecap="round"
                    transform="rotate(-90 80 80)"
                    className="transition-all duration-500"
                  />
                  {/* Center text */}
                  <text x="80" y="72" textAnchor="middle" className="fill-[var(--text-primary)] text-3xl font-bold">{totalSolved}</text>
                  <text x="80" y="95" textAnchor="middle" className="fill-[var(--text-muted)] text-sm">/{totalProblems}</text>
                </svg>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="flex-1 grid grid-cols-3 gap-4 w-full lg:w-auto">
              <div className="card p-4 bg-[var(--accent-green)]/5 border-[var(--accent-green)]/20">
                <div className="text-[var(--accent-green)] font-bold text-lg mb-1">Easy</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-[var(--accent-green)]">{difficultyStats.solvedEasy}</span>
                  <span className="text-[var(--text-muted)]">/{difficultyStats.totalEasy}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                  <div 
                    className="h-full bg-[var(--accent-green)] rounded-full transition-all duration-500"
                    style={{ width: `${(difficultyStats.solvedEasy / Math.max(difficultyStats.totalEasy, 1)) * 100}%` }}
                  />
                </div>
              </div>
              <div className="card p-4 bg-[var(--accent-yellow)]/5 border-[var(--accent-yellow)]/20">
                <div className="text-[var(--accent-yellow)] font-bold text-lg mb-1">Medium</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-[var(--accent-yellow)]">{difficultyStats.solvedMedium}</span>
                  <span className="text-[var(--text-muted)]">/{difficultyStats.totalMedium}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                  <div 
                    className="h-full bg-[var(--accent-yellow)] rounded-full transition-all duration-500"
                    style={{ width: `${(difficultyStats.solvedMedium / Math.max(difficultyStats.totalMedium, 1)) * 100}%` }}
                  />
                </div>
              </div>
              <div className="card p-4 bg-[var(--accent-red)]/5 border-[var(--accent-red)]/20">
                <div className="text-[var(--accent-red)] font-bold text-lg mb-1">Hard</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-[var(--accent-red)]">{difficultyStats.solvedHard}</span>
                  <span className="text-[var(--text-muted)]">/{difficultyStats.totalHard}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                  <div 
                    className="h-full bg-[var(--accent-red)] rounded-full transition-all duration-500"
                    style={{ width: `${(difficultyStats.solvedHard / Math.max(difficultyStats.totalHard, 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[var(--primary-500)]/10 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-7 h-7 text-[var(--primary-400)]" />
              </div>
              <div>
                <div className="text-3xl font-bold">{patterns.length}</div>
                <div className="text-base text-[var(--text-muted)]">Patterns</div>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[var(--accent-blue)]/10 flex items-center justify-center flex-shrink-0">
                <Target className="w-7 h-7 text-[var(--accent-blue)]" />
              </div>
              <div>
                <div className="text-3xl font-bold">{totalProblems}</div>
                <div className="text-base text-[var(--text-muted)]">Problems</div>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[var(--accent-green)]/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-7 h-7 text-[var(--accent-green)]" />
              </div>
              <div>
                <div className="text-3xl font-bold">{totalSolved}</div>
                <div className="text-base text-[var(--text-muted)]">Solved</div>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[var(--accent-purple)]/10 flex items-center justify-center flex-shrink-0">
                <div className="text-xl font-bold text-[var(--accent-purple)]">%</div>
              </div>
              <div>
                <div className="text-3xl font-bold">
                  {totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0}%
                </div>
                <div className="text-base text-[var(--text-muted)]">Progress</div>
              </div>
            </div>
          </div>
          {/* Sync Button */}
          <button
            onClick={() => syncFromLeetCode()}
            disabled={isSyncing}
            className="card p-6 hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[var(--accent-yellow)]/10 flex items-center justify-center flex-shrink-0">
                <RefreshCw className={`w-7 h-7 text-[var(--accent-yellow)] ${isSyncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold">{isSyncing ? 'Syncing...' : 'Sync'}</div>
                <div className="text-sm text-[var(--text-muted)]">From LeetCode</div>
              </div>
            </div>
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems..."
            className="w-full pl-14 pr-14 py-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-lg focus:outline-none focus:border-[var(--primary-500)] transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Patterns List */}
        <div className="space-y-5">
          {(search ? filteredPatterns : patterns).map((pattern, patternIndex) => {
            const progress = getPatternProgress(patternIndex);
            const isExpanded = expandedPattern === patternIndex;

            return (
              <div key={pattern.pattern} className="card overflow-hidden">
                {/* Pattern Header */}
                <button
                  onClick={() => togglePattern(patternIndex)}
                  className="w-full px-6 lg:px-8 py-5 lg:py-6 flex items-center justify-between bg-[var(--bg-tertiary)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`transform transition-transform flex-shrink-0 ${isExpanded ? 'rotate-90' : ''}`}>
                      <ChevronRight className="w-6 h-6 text-[var(--text-muted)]" />
                    </div>
                    <div className="text-left min-w-0">
                      <h3 className="font-bold text-xl lg:text-2xl truncate">{pattern.pattern}</h3>
                      <p className="text-base lg:text-lg text-[var(--text-muted)] mt-1">
                        {pattern.subpatterns.length} subpatterns • {progress.total} problems
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 flex-shrink-0 ml-4">
                    {/* Progress Bar */}
                    <div className="hidden sm:flex items-center gap-4">
                      <div className="w-40 lg:w-48 h-3 rounded-full bg-[var(--bg-secondary)] overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-[var(--primary-500)] to-[var(--accent-purple)]"
                          style={{ width: `${progress.total > 0 ? (progress.solved / progress.total) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-base lg:text-lg font-semibold text-[var(--text-muted)] min-w-[80px] text-right">
                        {progress.solved}/{progress.total}
                      </span>
                    </div>
                    {/* Mobile Progress */}
                    <span className="sm:hidden text-base font-semibold text-[var(--text-muted)]">
                      {progress.solved}/{progress.total}
                    </span>
                  </div>
                </button>

                {/* Subpatterns */}
                {isExpanded && (
                  <div className="border-t border-[var(--border-primary)]">
                    {pattern.subpatterns.map((subpattern, subIndex) => {
                      const subKey = `${patternIndex}-${subIndex}`;
                      const isSubExpanded = expandedSubpattern === subKey;
                      const solvedInSub = subpattern.problems.filter(p => isProblemSolved(p.id)).length;

                      return (
                        <div key={subpattern.title} className="border-b border-[var(--border-primary)] last:border-b-0">
                          {/* Subpattern Header */}
                          <button
                            onClick={() => toggleSubpattern(subKey)}
                            className="w-full px-6 lg:px-8 py-4 flex items-center justify-between hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              <div className={`transform transition-transform flex-shrink-0 ${isSubExpanded ? 'rotate-180' : ''}`}>
                                <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" />
                              </div>
                              <span className="text-base lg:text-lg text-[var(--text-secondary)] truncate">{subpattern.title}</span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-base font-semibold text-[var(--accent-green)]">{solvedInSub}</span>
                              <span className="text-base text-[var(--text-muted)]">/ {subpattern.problems.length}</span>
                            </div>
                          </button>

                          {/* Problems List */}
                          {isSubExpanded && (
                            <div className="bg-[var(--bg-secondary)] px-6 lg:px-8 py-3">
                              {subpattern.problems.map((problem) => (
                                <div
                                  key={problem.id}
                                  className="flex items-center justify-between py-4 border-b border-[var(--border-primary)] last:border-b-0"
                                >
                                  <div className="flex items-center gap-4 min-w-0 flex-1">
                                    <button
                                      onClick={(e) => handleToggleSolved(e, problem.id)}
                                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
                                        isProblemSolved(problem.id)
                                          ? 'bg-[var(--accent-green)] border-[var(--accent-green)]'
                                          : 'border-[var(--border-secondary)] hover:border-[var(--accent-green)]'
                                      }`}
                                    >
                                      {isProblemSolved(problem.id) && (
                                        <Check className="w-4 h-4 text-white" />
                                      )}
                                    </button>
                                    <span className="text-base text-[var(--text-muted)] w-16 flex-shrink-0 font-medium">#{problem.id}</span>
                                    <span className={`text-base lg:text-lg truncate ${isProblemSolved(problem.id) ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-primary)]'}`}>
                                      {problem.title}
                                    </span>
                                  </div>
                                  <a
                                    href={`https://leetcode.com/problems/${problem.slug}/`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-base font-semibold text-[var(--primary-400)] hover:bg-[var(--primary-500)]/10 transition-colors cursor-pointer flex-shrink-0 ml-4"
                                  >
                                    <span className="hidden sm:inline">Solve</span>
                                    <ExternalLink className="w-5 h-5" />
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {search && filteredPatterns.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold mb-3">No problems found</h3>
            <p className="text-lg text-[var(--text-muted)]">
              Try searching with different keywords
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatternsPage;
