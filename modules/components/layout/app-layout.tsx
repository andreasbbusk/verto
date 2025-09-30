"use client";

import { useEffect, ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAuthStore } from "@/modules/stores/authStore";
import { ProtectedRoute } from "./protected-route";
import { AppNavigation } from "./app-navigation";
import { toast } from "sonner";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { initialize, isInitialized, user } = useAuthStore();
  const pathname = usePathname();
  
  // Create QueryClient with optimized settings
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: (failureCount, error) => {
          if (error instanceof Error && error.message.includes('4')) return false;
          return failureCount < 2;
        },
        refetchOnWindowFocus: false,
      },
      mutations: {
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : 'An error occurred');
        },
        retry: 1,
      },
    },
  }));

  // Initialize auth store on client mount
  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [initialize, isInitialized]);

  // Determine if authentication is required based on route
  const requireAuth = pathname !== "/";

  const content = () => {
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
    return <div className="min-h-screen">{children}</div>;
  };

  return (
    <QueryClientProvider client={queryClient}>
      {content()}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
