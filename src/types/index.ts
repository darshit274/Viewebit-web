// User types
export interface User {
  id: string;
  uuid: string;
  name: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  schoolName?: string;
  city?: string;
  state?: string;
  role: 'student' | 'admin' | 'super_admin';
  avatarUrl?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    expiresIn: number;
  };
}

// Test types
export interface TestCategory {
  id: string;
  uuid: string;
  name: string;
  description?: string;
  parentId?: string;
  level: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TestSeries {
  id: string;
  uuid: string;
  title: string;
  description: string;
  categoryId: string;
  category?: TestCategory;
  price: number;
  duration: number; // in minutes
  totalQuestions: number;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  isActive: boolean;
  isPremium: boolean;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  uuid: string;
  questionText: string;
  questionTextGujarati?: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionAGujarati?: string;
  optionBGujarati?: string;
  optionCGujarati?: string;
  optionDGujarati?: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
  explanationGujarati?: string;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  subject?: string;
  topic?: string;
  marks: number;
  negativeMarks: number;
  createdAt: string;
  updatedAt: string;
}

export interface TestSession {
  id: string;
  uuid: string;
  userId: string;
  testId: string;
  startedAt: string;
  endedAt?: string;
  status: 'in_progress' | 'completed' | 'paused' | 'submitted';
  timeRemaining: number;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unansweredQuestions: number;
  score: number;
  percentage: number;
  rank?: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserAnswer {
  id: string;
  sessionId: string;
  questionId: string;
  selectedAnswer?: 'A' | 'B' | 'C' | 'D';
  isCorrect?: boolean;
  timeSpent: number;
  isFlagged: boolean;
  createdAt: string;
  updatedAt: string;
}

// PDF types
export interface PDFCategory {
  id: string;
  uuid: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PDF {
  id: string;
  uuid: string;
  title: string;
  description?: string;
  categoryId: string;
  category?: PDFCategory;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  thumbnailUrl?: string;
  downloadCount: number;
  isPremium: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Free Test types
export interface FreeTest {
  id: string;
  uuid: string;
  title: string;
  description: string;
  categoryId: string;
  category?: TestCategory;
  duration: number;
  totalQuestions: number;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Leaderboard types
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  score: number;
  percentage: number;
  testCount: number;
  averageScore: number;
}

export interface Leaderboard {
  period: 'daily' | 'weekly' | 'monthly' | 'all_time';
  testId?: string;
  testTitle?: string;
  entries: LeaderboardEntry[];
  userRank?: number;
  totalParticipants: number;
}

// Common types
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiListResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: PaginationMeta;
}

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// Dashboard types
export interface DashboardStats {
  totalTests: number;
  completedTests: number;
  averageScore: number;
  bestScore: number;
  currentRank: number;
  recentTests: Array<{
    id: string;
    title: string;
    score: number;
    percentage: number;
    completedAt: string;
  }>;
  performanceChart: Array<{
    date: string;
    score: number;
    tests: number;
  }>;
}