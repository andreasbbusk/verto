// Core domain types
export interface Flashcard {
  id: string;
  setId: string;
  front: string;
  back: string;
  starred: boolean;
  userId: string;
  createdAt: string;
  updatedAt?: string;
  reviewCount: number;
  performance?: CardPerformance;
}

export interface CardPerformance {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: string;
  lastReviewed: string;
  difficulty?: number;
  correctStreak?: number;
  totalReviews?: number;
}

export interface FlashcardSet {
  id: string;
  name: string;
  description: string;
  difficulty: number; // 1-5 scale (1=very easy, 5=very hard)
  starred: boolean;
  userId: string;
  createdAt: string;
  updatedAt?: string;
  cardCount?: number; // Optional, computed on-the-fly
  totalReviews?: number; // Optional, computed on-the-fly
  flashcards?: Flashcard[]; // Optional, populated when fetching details
}

// Profile represents the extended user data in profiles table
export interface Profile {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  lastLogin: string;
  updatedAt?: string;
  studyGoal: number;
  theme: "system" | "light" | "dark";
  notifications: boolean;
  totalStudySessions: number;
  currentStreak: number;
  longestStreak: number;
  totalCardsStudied: number;
}

// Legacy User type - deprecated, use Profile instead
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  lastLogin: string;
  updatedAt?: string;
  preferences: UserPreferences;
  stats: UserStats;
}

export interface UserPreferences {
  studyGoal: number;
  theme: "system" | "light" | "dark";
  notifications: boolean;
}

export interface UserStats {
  totalStudySessions: number;
  currentStreak: number;
  longestStreak: number;
  totalCardsStudied: number;
}

// API Data Transfer Objects
export interface CreateFlashcardData {
  setId: string;
  front: string;
  back: string;
  starred?: boolean;
}

// Internal data type for server operations
export interface CreateFlashcardDataInternal extends CreateFlashcardData {
  userId: string;
}

// Bulk flashcard creation
export interface BulkCreateFlashcardData {
  setId: string;
  flashcards: Array<Omit<CreateFlashcardData, "setId">>;
}

export interface BulkCreateResult {
  created: Flashcard[];
  failed: Array<{
    index: number;
    card: Omit<CreateFlashcardData, "setId">;
    error: string;
  }>;
  successCount: number;
  failureCount: number;
}

export interface ParsedFlashcard {
  front: string;
  back: string;
  starred?: boolean;
  error?: string;
}

export interface UpdateFlashcardData {
  front?: string;
  back?: string;
  starred?: boolean;
  reviewCount?: number;
  performance?: CardPerformance;
}

export interface CreateSetData {
  name: string;
  description?: string;
  difficulty?: number; // 1-5 scale, defaults to 3 (medium)
  starred?: boolean;
}

// Internal data type for server operations
export interface CreateSetDataInternal extends CreateSetData {
  userId: string;
}

export interface UpdateSetData {
  name?: string;
  description?: string;
  difficulty?: number;
  starred?: boolean;
}

export interface CreateProfileData {
  email: string;
  name: string;
  studyGoal?: number;
  theme?: "system" | "light" | "dark";
  notifications?: boolean;
}

export interface UpdateProfileData {
  name?: string;
  studyGoal?: number;
  theme?: "system" | "light" | "dark";
  notifications?: boolean;
  totalStudySessions?: number;
  currentStreak?: number;
  longestStreak?: number;
  totalCardsStudied?: number;
  lastLogin?: string;
}

// Legacy types for backwards compatibility
export interface CreateUserData {
  email: string;
  name: string;
  createdAt?: string;
  lastLogin?: string;
  preferences?: Partial<UserPreferences>;
  stats?: Partial<UserStats>;
}

export interface UpdateUserData {
  name?: string;
  preferences?: Partial<UserPreferences>;
  stats?: Partial<UserStats>;
  lastLogin?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AuthResponse {
  user: Profile;
}
