import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SanitizedUser } from "@/modules/types";

interface AuthState {
  user: SanitizedUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<SanitizedUser>;
  register: (
    email: string,
    password: string,
    name: string
  ) => Promise<SanitizedUser>;
  logout: () => Promise<void>;
  clearError: () => void;
  initialize: () => void;
  checkTokenExpiry: () => void;
  refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      isInitialized: false,

      login: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Login failed");
          }

          set({
            user: data.user,
            token: data.token,
            loading: false,
            error: null,
          });
          return data.user;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Login failed";
          set({ loading: false, error: errorMessage });
          throw error;
        }
      },

      register: async (email: string, password: string, name: string) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, name }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Registration failed");
          }

          set({
            user: data.user,
            token: data.token,
            loading: false,
            error: null,
          });
          return data.user;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Registration failed";
          set({ loading: false, error: errorMessage });
          throw error;
        }
      },

      logout: async () => {
        set({ loading: true, error: null });
        try {
          // Call logout API endpoint for any server-side cleanup
          await fetch("/api/auth/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          // Don't throw error for logout - always clear local state
          console.warn("Logout API call failed:", error);
        } finally {
          // Always clear user state locally
          set({ user: null, token: null, loading: false, error: null });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      initialize: () => {
        // Skip client-side token verification during initialization
        // Token validity will be checked server-side on API calls
        set({ isInitialized: true });
      },

      checkTokenExpiry: () => {
        // This function is kept for compatibility but does nothing
        // Token validity will be verified on API calls
      },

      refreshToken: async () => {
        const { token } = get();
        if (!token) {
          throw new Error("No token to refresh");
        }

        try {
          set({ loading: true, error: null });
          const response = await fetch("/api/auth/refresh", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Token refresh failed");
          }

          set({
            user: data.user,
            token: data.token,
            loading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Token refresh failed";
          set({
            user: null,
            token: null,
            loading: false,
            error: errorMessage,
          });
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        // Mark as initialized after rehydration
        state?.initialize();
      },
    }
  )
);
