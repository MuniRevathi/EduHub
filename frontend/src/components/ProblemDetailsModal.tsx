import { X, ExternalLink, Building2, Tag, Clock } from 'lucide-react';
import type { Problem } from '../data/types';
import { COMPANY_RECENCY_OPTIONS } from '../data/types';

interface ProblemDetailsModalProps {
  problem: Problem | null;
  onClose: () => void;
}

const ProblemDetailsModal = ({ problem, onClose }: ProblemDetailsModalProps) => {
  if (!problem) return null;

  const companies = problem.companies ? Object.entries(problem.companies) : [];

  const getRecencyLabel = (values: number[]) => {
    const labels = values.map(v => {
      const option = COMPANY_RECENCY_OPTIONS.find(o => o.value === String(v));
      return option?.label || '';
    }).filter(Boolean);
    return labels.length > 0 ? labels.join(', ') : '';
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl shadow-premium w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[var(--border-primary)]">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">{problem.title}</h2>
              {problem.isPremium && (
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-[var(--accent-yellow)]/20 text-[var(--accent-yellow)]">
                  PREMIUM
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                problem.difficulty === 'Easy' ? 'badge-easy' :
                problem.difficulty === 'Medium' ? 'badge-medium' :
                'badge-hard'
              }`}>
                {problem.difficulty}
              </span>
              <span className="text-sm text-[var(--text-muted)]">Problem #{problem.id}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Topics Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-[var(--primary-400)]" />
              <h3 className="font-semibold text-[var(--text-primary)]">Topics</h3>
              <span className="text-xs text-[var(--text-muted)]">({problem.topics?.length || 0})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {problem.topics?.length ? (
                problem.topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-3 py-1.5 rounded-lg text-sm bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-primary)] hover:border-[var(--primary-500)]/50 hover:text-[var(--primary-400)] transition-all cursor-pointer"
                  >
                    {topic}
                  </span>
                ))
              ) : (
                <span className="text-sm text-[var(--text-muted)]">No topics available</span>
              )}
            </div>
          </div>

          {/* Companies Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-[var(--accent-blue)]" />
              <h3 className="font-semibold text-[var(--text-primary)]">Companies</h3>
              <span className="text-xs text-[var(--text-muted)]">({companies.length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {companies.length > 0 ? (
                companies.map(([company, recency]) => (
                  <div
                    key={company}
                    className="group relative px-3 py-1.5 rounded-lg text-sm bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-primary)] hover:border-[var(--accent-blue)]/50 hover:text-[var(--accent-blue)] transition-all cursor-pointer"
                  >
                    {company}
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-[var(--bg-secondary)] text-xs text-[var(--text-muted)] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-[var(--border-primary)]">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {getRecencyLabel(recency as number[])}
                    </div>
                  </div>
                ))
              ) : (
                <span className="text-sm text-[var(--text-muted)]">No company data available</span>
              )}
            </div>
          </div>

          {/* Company Count by Recency */}
          {companies.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-[var(--accent-yellow)]" />
                <h3 className="font-semibold text-[var(--text-primary)]">Asked Recently</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {COMPANY_RECENCY_OPTIONS.slice(0, 4).map((option) => {
                  const count = companies.filter(([_, recency]) => 
                    (recency as number[]).includes(parseInt(option.value))
                  ).length;
                  return (
                    <div key={option.value} className="p-3 rounded-lg bg-[var(--bg-tertiary)] text-center">
                      <div className="text-lg font-bold text-[var(--primary-400)]">{count}</div>
                      <div className="text-xs text-[var(--text-muted)]">{option.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--border-primary)] bg-[var(--bg-tertiary)]">
          <a
            href={problem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-600)] text-white font-semibold hover:from-[var(--primary-600)] hover:to-[var(--primary-700)] transition-all cursor-pointer shadow-lg shadow-[var(--primary-500)]/20"
          >
            <ExternalLink className="w-5 h-5" />
            Solve on LeetCode
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailsModal;

