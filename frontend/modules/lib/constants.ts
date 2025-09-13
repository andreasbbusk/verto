// Application constants
export const APP_NAME = "Flashcards App";
export const APP_VERSION = "1.0.0";

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
  },
  FLASHCARDS: "/api/flashcards",
  SETS: "/api/sets",
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth-token",
  USER_PREFERENCES: "user-preferences",
} as const;

// Study settings
export const STUDY_SETTINGS = {
  DEFAULT_SESSION_SIZE: 20,
  MAX_SESSION_SIZE: 100,
  MIN_SESSION_SIZE: 5,
} as const;
