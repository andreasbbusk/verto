"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/modules/stores/authStore";

// Hook to automatically refresh tokens when needed
export function useAuthGuard() {
  const { token, refreshToken } = useAuthStore();

  useEffect(() => {
    if (!token) return;

    // Set up periodic token refresh (every 30 minutes)
    // This ensures tokens stay fresh without client-side verification
    const refreshInterval = setInterval(async () => {
      try {
        await refreshToken();
      } catch (error) {
        console.warn("Token refresh failed:", error);
        // If refresh fails, the user will be logged out by the auth store
      }
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(refreshInterval);
  }, [token, refreshToken]);
}
