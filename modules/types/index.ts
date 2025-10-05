// Core domain types
export interface Flashcard {
    id: number;
    setId: number;
    front: string;
    back: string;
    starred: boolean;
    userId: number;
    createdAt: string;
    updatedAt?: string;
    reviewCount: number;
    performance?: CardPerformance;
  }

export interface CardPerformance {
    easeFactor: number;
    interval: number;
    repetitions: number;
    nextReview: Date;
    lastReviewed: Date;
    difficulty?: number;
    correctStreak?: number;
    totalReviews?: number;
  }
  
  export interface FlashcardSet {
    id: number;
    name: string;
    description: string;
    difficulty: number; // 1-5 scale (1=very easy, 5=very hard)
    starred: boolean;
    userId: number;
    createdAt: string;
    updatedAt?: string;
    cardCount?: number; // Optional, computed on-the-fly
    flashcards?: Flashcard[]; // Optional, populated when fetching details
  }
  
  export interface User {
    id: number;
    email: string;
    name: string;
    password: string;
    createdAt: Date;
    lastLogin: Date;
    updatedAt?: Date;
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
    setId: number;
    front: string;
    back: string;
    starred?: boolean;
  }

  // Internal data type for server operations
  export interface CreateFlashcardDataInternal extends CreateFlashcardData {
    userId: number;
  }

  export interface UpdateFlashcardData {
    front?: string;
    back?: string;
    starred?: boolean;
  }
  
  export interface CreateSetData {
    name: string;
    description?: string;
    difficulty?: number; // 1-5 scale, defaults to 3 (medium)
    starred?: boolean;
  }

  // Internal data type for server operations
  export interface CreateSetDataInternal extends CreateSetData {
    userId: number;
  }

  export interface UpdateSetData {
    name?: string;
    description?: string;
    difficulty?: number;
    starred?: boolean;
  }
  
  export interface CreateUserData {
    email: string;
    name: string;
    password: string;
    createdAt?: Date;
    lastLogin?: Date;
    preferences?: Partial<UserPreferences>;
    stats?: Partial<UserStats>;
  }
  
  export interface UpdateUserData {
    name?: string;
    preferences?: Partial<UserPreferences>;
    stats?: Partial<UserStats>;
    lastLogin?: Date;
  }
  
  // Auth types
  export interface TokenPayload {
    userId: number;
    iat?: number;
    exp?: number;
  }
  
  export type SanitizedUser = Omit<User, "password">;
  
  // API Response types
  export interface ApiResponse<T> {
    data: T;
    message?: string;
  }
  
  export interface AuthResponse {
    user: SanitizedUser;
    token: string;
  }
  
  // Internal storage types
  export interface Counters {
    flashcardId: number;
    setId: number;
    userId: number;
  }