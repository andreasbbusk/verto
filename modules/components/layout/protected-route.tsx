"use client";

import { useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/modules/stores/authStore";
import { useAuthGuard } from "@/modules/hooks/use-auth-guard";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading, isInitialized } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Automatically manage token expiry and refresh
  useAuthGuard();

  // Redirect to landing page if not authenticated
  useEffect(() => {
    if (isInitialized && !loading && !user) {
      // Store the current path for redirect after login
      if (pathname !== "/") {
        sessionStorage.setItem("redirectPath", pathname);
      }
      router.push("/");
    }
  }, [isInitialized, loading, user, router, pathname]);

  // Show loading state during initialization or authentication check
  if (!isInitialized || loading) {
    return fallback || null;
  }

  // Don't render children if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return <>{children}</>;
}

// Higher-order component wrapper for easier usage
export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
