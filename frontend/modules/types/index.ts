// Core domain types
export interface Flashcard {
    id: number;
    front: string;
    back: string;
    set: string;
    userId: number;
    createdAt: string;
    reviewCount: number;
    updatedAt?: string;
  }
  
  export interface FlashcardSet {
    id: number;
    name: string;
    description?: string;
    userId: number;
    createdAt: string;
    cardCount: number;
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
    front: string;
    back: string;
    set?: string;
  }

  // Internal data type for server operations
  export interface CreateFlashcardDataInternal extends CreateFlashcardData {
    userId: number;
  }
  
  export interface UpdateFlashcardData {
    front?: string;
    back?: string;
    set?: string;
  }
  
  export interface CreateSetData {
    name: string;
    description?: string;
  }

  // Internal data type for server operations
  export interface CreateSetDataInternal extends CreateSetData {
    userId: number;
  }
  
  export interface UpdateSetData extends Partial<CreateSetData> {}
  
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