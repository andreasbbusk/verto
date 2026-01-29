"use client";

import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { makeQueryClient } from "@/modules/data/client/queryClient.client";
import { AppNavigation } from "./app-nav";
import { PageTransition } from "../ui/page-transition";

interface AppLayoutProps {
  children: ReactNode;
}

const protectedRoutes = [
  "/dashboard",
  "/sets",
  "/cards",
  "/study",
  "/calendar",
  "/settings",
];

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();

  const [queryClient] = useState(() => makeQueryClient());

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {isProtectedRoute ? (
        <AppNavigation>
          <PageTransition>{children}</PageTransition>
        </AppNavigation>
      ) : (
        <div className="min-h-screen">
          <PageTransition>{children}</PageTransition>
        </div>
      )}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
