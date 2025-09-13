import { useAuthStore } from "@/modules/stores/authStore";

// Authenticated fetch wrapper that includes JWT tokens
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const { token } = useAuthStore.getState();

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
  });
};

// Helper for authenticated API calls with automatic error handling and token refresh
export const apiCall = async <T>(
  url: string,
  options: RequestInit = {},
  retryCount = 0
): Promise<T> => {
  const response = await authenticatedFetch(url, options);

  // Handle 401 Unauthorized - try to refresh token once
  if (response.status === 401 && retryCount === 0) {
    try {
      const { refreshToken } = await import("@/modules/stores/authStore").then(
        (module) => module.useAuthStore.getState()
      );

      await refreshToken();

      // Retry the original request with the new token
      return apiCall<T>(url, options, retryCount + 1);
    } catch (error) {
      // Refresh failed, redirect to login
      window.location.href = "/";
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }

  return response.json();
};

// Convenience methods for common HTTP verbs
export const api = {
  get: <T>(url: string, options?: RequestInit) =>
    apiCall<T>(url, { method: "GET", ...options }),

  post: <T>(url: string, data?: any, options?: RequestInit) =>
    apiCall<T>(url, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),

  put: <T>(url: string, data?: any, options?: RequestInit) =>
    apiCall<T>(url, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),

  delete: <T>(url: string, options?: RequestInit) =>
    apiCall<T>(url, { method: "DELETE", ...options }),
};