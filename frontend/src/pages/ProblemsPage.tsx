import { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  X, 
  ExternalLink,
  Check,
  Building2,
  Tag,
  Clock,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { problems, getAllTopics, getAllCompanies, COMPANY_RECENCY_OPTIONS } from '../data';
import type { Problem } from '../data/types';
import ProblemDetailsModal from '../components/ProblemDetailsModal';
import { useSolvedProblems } from '../contexts/SolvedProblemsContext';

type DropdownType = 'difficulty' | 'topics' | 'recency' | null;

const ProblemsPage = () => {
  // Use global solved problems context
  const { solvedProblems, toggleSolved, isProblemSolved, isSyncing, syncFromLeetCode } = useSolvedProblems();
  
  // State
  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [companyRecency, setCompanyRecency] = useState('all');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [companySearch, setCompanySearch] = useState('');
  const [companyPage, setCompanyPage] = useState(1);
  
  // Single dropdown state instead of multiple booleans
  const [openDropdown, setOpenDropdown] = useState<DropdownType>(null);
  const [topicSearch, setTopicSearch] = useState('');

  // Ref for dropdown container
  const dropdownContainerRef = useRef<HTMLDivElement>(null);

  // Get all data
  const allTopics = useMemo(() => getAllTopics(), []);
  const allCompanies = useMemo(() => getAllCompanies(), []);

  // Calculate total and solved stats by difficulty
  const totalStats = useMemo(() => {
    const stats = { easy: 0, medium: 0, hard: 0, total: 0 };
    problems.forEach(p => {
      stats.total++;
      if (p.difficulty === 'Easy') stats.easy++;
      else if (p.difficulty === 'Medium') stats.medium++;
      else if (p.difficulty === 'Hard') stats.hard++;
    });
    return stats;
  }, []);

  const solvedStats = useMemo(() => {
    const stats = { easy: 0, medium: 0, hard: 0, total: 0 };
    solvedProblems.forEach(id => {
      const problem = problems.find(p => p.id === id);
      if (problem) {
        stats.total++;
        if (problem.difficulty === 'Easy') stats.easy++;
        else if (problem.difficulty === 'Medium') stats.medium++;
        else if (problem.difficulty === 'Hard') stats.hard++;
      }
    });
    return stats;
  }, [solvedProblems]);

  // Company counts
  const companyCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    problems.forEach(p => {
      if (p.companies) {
        Object.keys(p.companies).forEach(c => {
          counts[c] = (counts[c] || 0) + 1;
        });
      }
    });
    return counts;
  }, []);

  // Filtered companies for sidebar
  const filteredCompaniesForSidebar = useMemo(() => {
    return allCompanies
      .filter(c => c.toLowerCase().includes(companySearch.toLowerCase()))
      .map(c => ({ name: c, count: companyCounts[c] || 0 }))
      .sort((a, b) => b.count - a.count);
  }, [allCompanies, companySearch, companyCounts]);

  const COMPANIES_PER_PAGE = 12;
  const totalCompanyPages = Math.ceil(filteredCompaniesForSidebar.length / COMPANIES_PER_PAGE);
  const paginatedCompanies = filteredCompaniesForSidebar.slice(
    (companyPage - 1) * COMPANIES_PER_PAGE,
    companyPage * COMPANIES_PER_PAGE
  );

  // Click outside handler - close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownContainerRef.current && !dropdownContainerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    // Use click instead of mousedown for more reliable behavior
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);


  // Filter problems
  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      if (search && !problem.title.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (selectedDifficulty && problem.difficulty !== selectedDifficulty) {
        return false;
      }
      if (selectedTopics.length > 0) {
        if (!problem.topics?.some(t => selectedTopics.includes(t))) {
          return false;
        }
      }
      // Filter by selected companies
      if (selectedCompanies.length > 0) {
        if (!problem.companies) return false;
        const problemCompanies = Object.keys(problem.companies);
        if (!selectedCompanies.some(c => problemCompanies.includes(c))) {
          return false;
        }
        // If companies selected AND recency filter is active, check recency for selected companies
        if (companyRecency !== 'all') {
          const recencyValue = parseInt(companyRecency);
          const hasMatchingRecency = selectedCompanies.some(company => {
            const companyData = problem.companies?.[company];
            return Array.isArray(companyData) && companyData.includes(recencyValue);
          });
          if (!hasMatchingRecency) return false;
        }
      } else if (companyRecency !== 'all') {
        // If NO companies selected but recency filter is active, check recency across ALL companies
        if (!problem.companies) return false;
        const recencyValue = parseInt(companyRecency);
        const hasAnyMatchingRecency = Object.values(problem.companies).some(
          (recencyArray) => Array.isArray(recencyArray) && recencyArray.includes(recencyValue)
        );
        if (!hasAnyMatchingRecency) return false;
      }
      if (showPremiumOnly && !problem.isPremium) {
        return false;
      }
      return true;
    });
  }, [search, selectedDifficulty, selectedTopics, selectedCompanies, companyRecency, showPremiumOnly]);

  // Pagination
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const paginatedProblems = filteredProblems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedDifficulty, selectedTopics, selectedCompanies, companyRecency, showPremiumOnly]);

  // Toggle solved using context
  const handleToggleSolved = (e: React.MouseEvent, problemId: string) => {
    e.stopPropagation();
    toggleSolved(problemId);
  };

  // Toggle company selection
  const toggleCompany = (company: string) => {
    setSelectedCompanies(prev => 
      prev.includes(company) 
        ? prev.filter(c => c !== company)
        : [...prev, company]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch('');
    setSelectedDifficulty('');
    setSelectedTopics([]);
    setSelectedCompanies([]);
    setCompanyRecency('all');
    setShowPremiumOnly(false);
  };

  // Toggle dropdown helper
  const toggleDropdown = (dropdown: DropdownType, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdown(prev => prev === dropdown ? null : dropdown);
  };

  const hasActiveFilters = search || selectedDifficulty || selectedTopics.length > 0 || 
    selectedCompanies.length > 0 || companyRecency !== 'all' || showPremiumOnly;

  // Count active filters
  const activeFilterCount = [
    selectedDifficulty ? 1 : 0,
    selectedTopics.length,
    selectedCompanies.length,
    companyRecency !== 'all' ? 1 : 0,
    showPremiumOnly ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen pt-[180px] sm:pt-[200px] pb-16 bg-[var(--bg-primary)]">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Company-Wise Problems</h1>
          <p className="text-base sm:text-lg lg:text-xl text-[var(--text-secondary)] mb-4">
            Practice {problems.length.toLocaleString()}+ problems asked by top tech companies
          </p>
          <button
            onClick={() => syncFromLeetCode()}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent-yellow)]/10 border border-[var(--accent-yellow)]/30 text-[var(--accent-yellow)] font-semibold hover:bg-[var(--accent-yellow)]/20 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing from LeetCode...' : 'Sync Solved from LeetCode'}
          </button>
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
                  {/* Easy progress */}
                  <circle 
                    cx="80" cy="80" r="65" 
                    stroke="var(--accent-green)" 
                    strokeWidth="12" 
                    fill="none"
                    strokeDasharray={`${(solvedStats.easy / Math.max(totalStats.easy, 1)) * 408} 408`}
                    strokeLinecap="round"
                    transform="rotate(-90 80 80)"
                    className="transition-all duration-500"
                  />
                  {/* Center text */}
                  <text x="80" y="72" textAnchor="middle" className="fill-[var(--text-primary)] text-3xl font-bold">{solvedStats.total}</text>
                  <text x="80" y="95" textAnchor="middle" className="fill-[var(--text-muted)] text-sm">/{totalStats.total}</text>
                </svg>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="flex-1 grid grid-cols-3 gap-4 w-full lg:w-auto">
              <div className="card p-4 bg-[var(--accent-green)]/5 border-[var(--accent-green)]/20">
                <div className="text-[var(--accent-green)] font-bold text-lg mb-1">Easy</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-[var(--accent-green)]">{solvedStats.easy}</span>
                  <span className="text-[var(--text-muted)]">/{totalStats.easy}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                  <div 
                    className="h-full bg-[var(--accent-green)] rounded-full transition-all duration-500"
                    style={{ width: `${(solvedStats.easy / Math.max(totalStats.easy, 1)) * 100}%` }}
                  />
                </div>
              </div>
              <div className="card p-4 bg-[var(--accent-yellow)]/5 border-[var(--accent-yellow)]/20">
                <div className="text-[var(--accent-yellow)] font-bold text-lg mb-1">Medium</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-[var(--accent-yellow)]">{solvedStats.medium}</span>
                  <span className="text-[var(--text-muted)]">/{totalStats.medium}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                  <div 
                    className="h-full bg-[var(--accent-yellow)] rounded-full transition-all duration-500"
                    style={{ width: `${(solvedStats.medium / Math.max(totalStats.medium, 1)) * 100}%` }}
                  />
                </div>
              </div>
              <div className="card p-4 bg-[var(--accent-red)]/5 border-[var(--accent-red)]/20">
                <div className="text-[var(--accent-red)] font-bold text-lg mb-1">Hard</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-[var(--accent-red)]">{solvedStats.hard}</span>
                  <span className="text-[var(--text-muted)]">/{totalStats.hard}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                  <div 
                    className="h-full bg-[var(--accent-red)] rounded-full transition-all duration-500"
                    style={{ width: `${(solvedStats.hard / Math.max(totalStats.hard, 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Main Content - LEFT SIDE */}
          <div className="flex-1 min-w-0">
            {/* Filters Bar */}
            <div className="card p-6 mb-6">
              {/* Row 1: Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search problems..."
                    className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-base focus:outline-none focus:border-[var(--primary-500)] transition-colors"
                  />
                </div>
              </div>

              {/* Row 2: Filter Buttons */}
              <div ref={dropdownContainerRef} className="flex items-center gap-3 flex-wrap relative z-20">
                {/* Difficulty Dropdown */}
                <div className="relative">
                  <button
                    onClick={(e) => toggleDropdown('difficulty', e)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all cursor-pointer text-sm font-medium whitespace-nowrap ${
                      selectedDifficulty 
                        ? 'bg-[var(--primary-500)]/10 border-[var(--primary-500)]/30 text-[var(--primary-400)]'
                        : 'bg-[var(--bg-tertiary)] border-[var(--border-primary)] text-[var(--text-secondary)] hover:border-[var(--border-secondary)]'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    <span>{selectedDifficulty || 'Difficulty'}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'difficulty' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {openDropdown === 'difficulty' && (
                    <div className="absolute top-full mt-2 left-0 w-48 py-2 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl shadow-2xl z-50">
                      {['Easy', 'Medium', 'Hard'].map((diff) => (
                        <button
                          key={diff}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDifficulty(selectedDifficulty === diff ? '' : diff);
                            setOpenDropdown(null);
                          }}
                          className={`w-full px-5 py-3 text-left text-base hover:bg-[var(--bg-tertiary)] transition-colors flex items-center justify-between cursor-pointer ${
                            selectedDifficulty === diff ? 'text-[var(--primary-400)]' : 'text-[var(--text-secondary)]'
                          }`}
                        >
                          <span className={`font-semibold ${
                            diff === 'Easy' ? 'text-[var(--accent-green)]' :
                            diff === 'Medium' ? 'text-[var(--accent-yellow)]' :
                            'text-[var(--accent-red)]'
                          }`}>{diff}</span>
                          {selectedDifficulty === diff && <Check className="w-5 h-5" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Topics Dropdown */}
                <div className="relative">
                  <button
                    onClick={(e) => toggleDropdown('topics', e)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all cursor-pointer text-sm font-medium whitespace-nowrap ${
                      selectedTopics.length > 0
                        ? 'bg-[var(--primary-500)]/10 border-[var(--primary-500)]/30 text-[var(--primary-400)]'
                        : 'bg-[var(--bg-tertiary)] border-[var(--border-primary)] text-[var(--text-secondary)] hover:border-[var(--border-secondary)]'
                    }`}
                  >
                    <Tag className="w-4 h-4" />
                    <span>{selectedTopics.length > 0 ? `${selectedTopics.length} Topics` : 'Topics'}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'topics' ? 'rotate-180' : ''}`} />
                  </button>

                  {openDropdown === 'topics' && (
                    <div 
                      className="absolute top-full mt-2 left-0 w-80 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl shadow-2xl z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-4 border-b border-[var(--border-primary)]">
                        <input
                          type="text"
                          value={topicSearch}
                          onChange={(e) => setTopicSearch(e.target.value)}
                          placeholder="Search topics..."
                          className="w-full px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-base focus:outline-none focus:border-[var(--primary-500)]"
                        />
                      </div>
                      <div className="max-h-[300px] overflow-y-auto p-3">
                        {allTopics
                          .filter(t => t.toLowerCase().includes(topicSearch.toLowerCase()))
                          .map((topic) => (
                            <label
                              key={topic}
                              className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-[var(--bg-tertiary)] cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedTopics.includes(topic)}
                                onChange={() => {
                                  setSelectedTopics(prev =>
                                    prev.includes(topic)
                                      ? prev.filter(t => t !== topic)
                                      : [...prev, topic]
                                  );
                                }}
                                className="w-5 h-5 rounded border-[var(--border-secondary)] text-[var(--primary-500)] focus:ring-[var(--primary-500)] cursor-pointer"
                              />
                              <span className="text-base text-[var(--text-secondary)]">{topic}</span>
                            </label>
                          ))}
                      </div>
                      <div className="p-4 border-t border-[var(--border-primary)] flex justify-between">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTopics([]);
                          }}
                          className="text-base text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer font-medium"
                        >
                          Clear All
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdown(null);
                          }}
                          className="text-base text-[var(--primary-400)] font-semibold cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Recency Dropdown */}
                <div className="relative">
                  <button
                    onClick={(e) => toggleDropdown('recency', e)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all cursor-pointer text-sm font-medium whitespace-nowrap ${
                      companyRecency !== 'all'
                        ? 'bg-[var(--accent-yellow)]/10 border-[var(--accent-yellow)]/30 text-[var(--accent-yellow)]'
                        : 'bg-[var(--bg-tertiary)] border-[var(--border-primary)] text-[var(--text-secondary)] hover:border-[var(--border-secondary)]'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>{COMPANY_RECENCY_OPTIONS.find(o => o.value === companyRecency)?.label || 'All time'}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'recency' ? 'rotate-180' : ''}`} />
                  </button>

                  {openDropdown === 'recency' && (
                    <div className="absolute top-full mt-2 left-0 w-56 py-2 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl shadow-2xl z-50">
                      {COMPANY_RECENCY_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCompanyRecency(option.value);
                            setOpenDropdown(null);
                          }}
                          className={`w-full px-5 py-3 text-left text-base hover:bg-[var(--bg-tertiary)] transition-colors flex items-center justify-between cursor-pointer ${
                            companyRecency === option.value ? 'text-[var(--accent-yellow)]' : 'text-[var(--text-secondary)]'
                          }`}
                        >
                          {option.label}
                          {companyRecency === option.value && <Check className="w-5 h-5" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Premium Toggle */}
                <button
                  onClick={() => setShowPremiumOnly(!showPremiumOnly)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all cursor-pointer text-sm font-medium whitespace-nowrap ${
                    showPremiumOnly
                      ? 'bg-[var(--accent-purple)]/10 border-[var(--accent-purple)]/30 text-[var(--accent-purple)]'
                      : 'bg-[var(--bg-tertiary)] border-[var(--border-primary)] text-[var(--text-secondary)] hover:border-[var(--border-secondary)]'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Premium</span>
                </button>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all cursor-pointer text-sm font-medium whitespace-nowrap ${
                    hasActiveFilters
                      ? 'text-[var(--accent-red)] hover:bg-[var(--accent-red)]/10 opacity-100'
                      : 'text-[var(--text-muted)] opacity-50 pointer-events-none'
                  }`}
                >
                  <X className="w-4 h-4" />
                  <span>Clear All</span>
                </button>
              </div>

              {/* Row 3: Active Filters Display */}
              <div className="min-h-[50px] flex items-center gap-3 mt-4 pt-4 border-t border-[var(--border-primary)]">
                <span className="text-sm text-[var(--text-muted)] font-semibold whitespace-nowrap">
                  Active ({activeFilterCount}):
                </span>
                <div className="flex-1 flex items-center gap-2 flex-wrap">
                  {activeFilterCount === 0 ? (
                    <span className="text-sm text-[var(--text-muted)] italic">No filters selected</span>
                  ) : (
                    <>
                      {selectedDifficulty && (
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                          selectedDifficulty === 'Easy' ? 'bg-[var(--accent-green)]/15 text-[var(--accent-green)] border border-[var(--accent-green)]/30' :
                          selectedDifficulty === 'Medium' ? 'bg-[var(--accent-yellow)]/15 text-[var(--accent-yellow)] border border-[var(--accent-yellow)]/30' :
                          'bg-[var(--accent-red)]/15 text-[var(--accent-red)] border border-[var(--accent-red)]/30'
                        }`}>
                          {selectedDifficulty}
                          <X className="w-3 h-3 cursor-pointer hover:opacity-70" onClick={() => setSelectedDifficulty('')} />
                        </span>
                      )}
                      {companyRecency !== 'all' && (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--accent-yellow)]/15 text-[var(--accent-yellow)] border border-[var(--accent-yellow)]/30 whitespace-nowrap">
                          {COMPANY_RECENCY_OPTIONS.find(o => o.value === companyRecency)?.label}
                          <X className="w-3 h-3 cursor-pointer hover:opacity-70" onClick={() => setCompanyRecency('all')} />
                        </span>
                      )}
                      {showPremiumOnly && (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--accent-purple)]/15 text-[var(--accent-purple)] border border-[var(--accent-purple)]/30 whitespace-nowrap">
                          Premium
                          <X className="w-3 h-3 cursor-pointer hover:opacity-70" onClick={() => setShowPremiumOnly(false)} />
                        </span>
                      )}
                      {selectedTopics.map(topic => (
                        <span key={topic} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--primary-500)]/15 text-[var(--primary-400)] border border-[var(--primary-500)]/30 whitespace-nowrap">
                          {topic}
                          <X className="w-3 h-3 cursor-pointer hover:opacity-70" onClick={() => setSelectedTopics(prev => prev.filter(t => t !== topic))} />
                        </span>
                      ))}
                      {selectedCompanies.map(company => (
                        <span key={company} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--accent-blue)]/15 text-[var(--accent-blue)] border border-[var(--accent-blue)]/30 whitespace-nowrap">
                          {company}
                          <X className="w-3 h-3 cursor-pointer hover:opacity-70" onClick={() => setSelectedCompanies(prev => prev.filter(c => c !== company))} />
                        </span>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-base text-[var(--text-muted)]">
                Showing <span className="font-bold text-[var(--text-primary)]">{paginatedProblems.length}</span> of{' '}
                <span className="font-bold text-[var(--text-primary)]">{filteredProblems.length}</span> problems
              </p>
              <div className="flex items-center gap-4">
                <span className="text-base text-[var(--text-muted)]">Per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-lg px-4 py-2.5 text-base text-[var(--text-secondary)] cursor-pointer focus:outline-none focus:border-[var(--primary-500)]"
                >
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            {/* Problems Table */}
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[var(--bg-tertiary)] border-b border-[var(--border-primary)]">
                      <th className="px-5 py-5 text-left text-base font-bold text-[var(--text-secondary)] w-20">Status</th>
                      <th className="px-5 py-5 text-left text-base font-bold text-[var(--text-secondary)]">Problem</th>
                      <th className="px-5 py-5 text-left text-base font-bold text-[var(--text-secondary)] w-36">Difficulty</th>
                      <th className="px-5 py-5 text-left text-base font-bold text-[var(--text-secondary)]">Topics</th>
                      <th className="px-5 py-5 text-left text-base font-bold text-[var(--text-secondary)]">Companies</th>
                      <th className="px-5 py-5 text-left text-base font-bold text-[var(--text-secondary)] w-32">Practice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProblems.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-20 text-[var(--text-muted)]">
                          <div className="text-5xl mb-4">🔍</div>
                          <p className="text-xl font-semibold mb-2">No problems found</p>
                          <p className="text-base">Try adjusting your filters</p>
                        </td>
                      </tr>
                    ) : (
                      paginatedProblems.map((problem, index) => (
                        <tr 
                          key={problem.id} 
                          className={`border-b border-[var(--border-primary)] cursor-pointer transition-colors hover:bg-[var(--bg-card-hover)] ${
                            index % 2 === 0 ? 'bg-[var(--bg-card)]' : 'bg-[var(--bg-secondary)]'
                          }`}
                          onClick={() => setSelectedProblem(problem)}
                        >
                          <td className="px-5 py-5">
                            <button
                              onClick={(e) => handleToggleSolved(e, problem.id)}
                              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                                isProblemSolved(problem.id)
                                  ? 'bg-[var(--accent-green)] border-[var(--accent-green)]'
                                  : 'border-[var(--border-secondary)] hover:border-[var(--accent-green)]'
                              }`}
                            >
                              {isProblemSolved(problem.id) && (
                                <Check className="w-5 h-5 text-white" />
                              )}
                            </button>
                          </td>
                          <td className="px-5 py-5">
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-base text-[var(--text-primary)] hover:text-[var(--primary-400)] transition-colors">
                                {problem.title}
                              </span>
                              {problem.isPremium && (
                                <span className="px-2.5 py-1 rounded text-xs font-bold bg-[var(--accent-yellow)]/20 text-[var(--accent-yellow)]">
                                  PRO
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-5">
                            <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                              problem.difficulty === 'Easy' ? 'bg-[var(--accent-green)]/15 text-[var(--accent-green)]' :
                              problem.difficulty === 'Medium' ? 'bg-[var(--accent-yellow)]/15 text-[var(--accent-yellow)]' :
                              'bg-[var(--accent-red)]/15 text-[var(--accent-red)]'
                            }`}>
                              {problem.difficulty}
                            </span>
                          </td>
                          <td className="px-5 py-5">
                            <div className="flex flex-wrap gap-2">
                              {problem.topics?.slice(0, 2).map((topic) => (
                                <span
                                  key={topic}
                                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                                >
                                  {topic}
                                </span>
                              ))}
                              {problem.topics && problem.topics.length > 2 && (
                                <span className="px-3 py-1.5 rounded-lg text-sm font-bold bg-[var(--primary-500)]/10 text-[var(--primary-400)]">
                                  +{problem.topics.length - 2}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-5">
                            <div className="flex flex-wrap gap-2">
                              {problem.companies && Object.keys(problem.companies).slice(0, 2).map((company) => (
                                <span
                                  key={company}
                                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                                >
                                  {company}
                                </span>
                              ))}
                              {problem.companies && Object.keys(problem.companies).length > 2 && (
                                <span className="px-3 py-1.5 rounded-lg text-sm font-bold bg-[var(--accent-blue)]/10 text-[var(--accent-blue)]">
                                  +{Object.keys(problem.companies).length - 2}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-5">
                            <a
                              href={problem.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--primary-500)] text-white text-sm font-bold hover:bg-[var(--primary-600)] transition-colors cursor-pointer"
                            >
                              Solve
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-secondary)] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--border-secondary)] transition-all cursor-pointer text-base font-semibold"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>
                
                <div className="flex items-center gap-4">
                  <span className="text-base text-[var(--text-muted)]">Page</span>
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        setCurrentPage(page);
                      }
                    }}
                    className="w-20 px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-center text-base font-semibold focus:outline-none focus:border-[var(--primary-500)]"
                  />
                  <span className="text-base text-[var(--text-muted)]">of {totalPages}</span>
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-secondary)] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--border-secondary)] transition-all cursor-pointer text-base font-semibold"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar - Company Filter */}
          <div className="lg:w-[340px] flex-shrink-0 order-first lg:order-last">
            <div className="card p-6 lg:sticky lg:top-24">
              {/* Company Header with Title and Pagination */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Building2 className="w-6 h-6 text-[var(--primary-400)]" />
                  <h3 className="font-bold text-xl">Companies</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCompanyPage(p => Math.max(1, p - 1))}
                    disabled={companyPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:bg-[var(--primary-500)] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCompanyPage(p => Math.min(totalCompanyPages, p + 1))}
                    disabled={companyPage === totalCompanyPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:bg-[var(--primary-500)] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Company Search */}
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={companySearch}
                  onChange={(e) => { setCompanySearch(e.target.value); setCompanyPage(1); }}
                  placeholder="Search companies..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-base focus:outline-none focus:border-[var(--primary-500)] transition-colors"
                />
              </div>

              {/* Company Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {paginatedCompanies.map(({ name, count }) => (
                  <button
                    key={name}
                    onClick={() => toggleCompany(name)}
                    className={`flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      selectedCompanies.includes(name)
                        ? 'bg-[var(--primary-500)] text-white'
                        : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'
                    }`}
                  >
                    <span className="truncate mr-2">{name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${
                      selectedCompanies.includes(name)
                        ? 'bg-white/20 text-white'
                        : 'bg-[var(--primary-500)]/20 text-[var(--primary-400)]'
                    }`}>
                      {count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Page Indicator - BELOW the grid */}
              <div className="text-center text-sm text-[var(--text-muted)] mb-4 font-medium py-2 border-t border-b border-[var(--border-primary)]">
                Page {companyPage} of {totalCompanyPages}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => setSelectedCompanies([])}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-[var(--primary-500)] text-[var(--primary-400)] hover:bg-[var(--primary-500)] hover:text-white transition-colors cursor-pointer font-bold"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
                <button
                  className="flex-1 px-4 py-3 rounded-xl bg-[var(--primary-500)] text-white font-bold hover:bg-[var(--primary-600)] transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {/* Selected Count */}
              <div className={`p-4 rounded-xl border transition-all ${
                selectedCompanies.length > 0
                  ? 'bg-[var(--primary-500)]/10 border-[var(--primary-500)]/30'
                  : 'bg-[var(--bg-tertiary)] border-[var(--border-primary)]'
              }`}>
                <p className={`text-base font-semibold ${
                  selectedCompanies.length > 0 ? 'text-[var(--primary-400)]' : 'text-[var(--text-muted)]'
                }`}>
                  <span className="font-bold text-lg">{selectedCompanies.length}</span> companies selected
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Details Modal */}
      <ProblemDetailsModal 
        problem={selectedProblem} 
        onClose={() => setSelectedProblem(null)} 
      />
    </div>
  );
};

export default ProblemsPage;
