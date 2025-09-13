"use client";

import { useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/modules/stores/authStore";
import { ProtectedRoute } from "./protected-route";
import { AppNavigation } from "./app-navigation";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { initialize, isInitialized, user } = useAuthStore();
  const pathname = usePathname();

  // Initialize auth store on client mount
  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [initialize, isInitialized]);

  // Determine if authentication is required based on route
  const requireAuth = pathname !== "/";

  // If authentication is required and user is not authenticated,
  // let ProtectedRoute handle the redirect
  if (requireAuth && !user) {
    return (
      <ProtectedRoute>
        <AppNavigation>{children}</AppNavigation>
      </ProtectedRoute>
    );
  }

  // If user is authenticated, show the navigation layout
  if (user) {
    return <AppNavigation>{children}</AppNavigation>;
  }

  // For unauthenticated pages (like landing page), show children without navigation
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
