// Problem Types
export interface Problem {
  _id?: { $oid: string };
  id: string;
  title: string;
  url: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isPremium: boolean;
  topics: string[];
  companies: Record<string, number[] | undefined>;
  solved?: boolean;
}

// Pattern Types
export interface PatternProblem {
  id: number;
  title: string;
  slug: string;
}

export interface SubPattern {
  title: string;
  problems: PatternProblem[];
}

export interface PatternGroup {
  pattern: string;
  subpatterns: SubPattern[];
}

// Filter Types
export interface FilterState {
  search: string;
  difficulty: string;
  topics: string[];
  companies: string[];
  companyRecency: string;
  showPremiumOnly: boolean;
  showSolvedOnly: boolean;
}

// Company Recency Options
export const COMPANY_RECENCY_OPTIONS = [
  { label: '30 days', value: '1' },
  { label: '3 months', value: '2' },
  { label: '6 months', value: '3' },
  { label: 'More than 6 months', value: '4' },
  { label: 'All time', value: 'all' },
] as const;

// Popular Companies
export const POPULAR_COMPANIES = [
  'Google',
  'Amazon',
  'Meta',
  'Microsoft',
  'Apple',
  'Netflix',
  'Adobe',
  'Bloomberg',
  'Goldman Sachs',
  'Uber',
  'Airbnb',
  'LinkedIn',
  'Twitter',
  'Stripe',
  'Salesforce',
  'Oracle',
  'VMware',
  'Nvidia',
  'Intel',
  'Cisco',
] as const;

// Stats Types
export interface UserStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  streak: number;
  lastSolvedDate: string | null;
}

