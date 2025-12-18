export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  enabled: boolean;
  avatar?: string;
  bio?: string;
  college?: string;
  location?: string;
  website?: string;
  leetcodeUsername?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  solvedProblems?: string[];
  solvedPatterns?: number[];
  streak?: number;
  lastActiveDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  instructorId: number;
  instructorName?: string;
  price: number;
  durationHours?: number;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  category: 'PROGRAMMING' | 'DESIGN' | 'BUSINESS' | 'MARKETING' | 'PHOTOGRAPHY' | 'MUSIC' | 'HEALTH' | 'LANGUAGE' | 'OTHER';
  imageUrl?: string;
  enrolledCount: number;
  maxStudents?: number;
  isPublished: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: number;
  studentId: number;
  courseId: number;
  status: 'ACTIVE' | 'COMPLETED' | 'DROPPED' | 'SUSPENDED';
  progress: number;
  enrolledAt: string;
  completedAt?: string;
  course?: Course;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  token: string;
  avatar?: string;
  streak?: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface EnrollmentRequest {
  userId: number;
  courseId: number;
}

export interface ProgressUpdateRequest {
  progress: number;
}

export interface EnrollmentCheckResponse {
  enrolled: boolean;
  enrollment: Enrollment | null;
}

export interface LeetCodeStats {
  username: string;
  ranking: number;
  reputation: number;
  solved: {
    easy: number;
    medium: number;
    hard: number;
    total: number;
  };
}

export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  college?: string;
  location?: string;
  website?: string;
  leetcodeUsername?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}
