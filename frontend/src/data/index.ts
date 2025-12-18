import problemsJson from './problems.json';
import patternsDataArray from './patternsData';
import type { Problem, PatternGroup } from './types';

// Export problems data with proper typing
export const problems = problemsJson as Problem[];

// Export patterns data  
export const patterns: PatternGroup[] = patternsDataArray;
export const patternsData: PatternGroup[] = patternsDataArray;

// Company recency options
export const COMPANY_RECENCY_OPTIONS = [
  { value: 'all', label: 'All time' },
  { value: '1', label: 'Last 30 days' },
  { value: '2', label: 'Last 3 months' },
  { value: '3', label: 'Last 6 months' },
  { value: '4', label: 'More than 6 months' },
];

// Helper function to get all unique topics
export const getAllTopics = (): string[] => {
  const topicsSet = new Set<string>();
  problems.forEach(problem => {
    problem.topics?.forEach(topic => topicsSet.add(topic));
  });
  return Array.from(topicsSet).sort();
};

// Helper function to get all unique companies
export const getAllCompanies = (): string[] => {
  const companiesSet = new Set<string>();
  problems.forEach(problem => {
    if (problem.companies) {
      Object.keys(problem.companies).forEach(company => companiesSet.add(company));
    }
  });
  return Array.from(companiesSet).sort();
};

// Helper function to filter problems by company
export const getProblemsByCompany = (companyName: string, recency?: string): Problem[] => {
  return problems.filter(problem => {
    if (!problem.companies || !problem.companies[companyName]) return false;
    if (recency && recency !== 'all') {
      const recencyValue = parseInt(recency);
      return problem.companies[companyName].includes(recencyValue);
    }
    return true;
  });
};

// Helper function to get problem stats
export const getProblemStats = () => {
  const totalProblems = problems.length;
  const easy = problems.filter(p => p.difficulty === 'Easy').length;
  const medium = problems.filter(p => p.difficulty === 'Medium').length;
  const hard = problems.filter(p => p.difficulty === 'Hard').length;
  const premium = problems.filter(p => p.isPremium).length;
  
  return { totalProblems, easy, medium, hard, premium };
};

// Export all types
export * from './types';
