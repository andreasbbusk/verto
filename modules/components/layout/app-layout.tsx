"use client";

import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useSession } from "next-auth/react";
import { AppNavigation } from "./app-navigation";
import { PageTransition } from "../ui/page-transition";
import { toast } from "sonner";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
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

  const content = () => {
    if (session?.user) {
      return (
        <AppNavigation>
          <PageTransition>{children}</PageTransition>
        </AppNavigation>
      );
    }

    return (
      <div className="min-h-screen">
        <PageTransition>{children}</PageTransition>
      </div>
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      {content()}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
