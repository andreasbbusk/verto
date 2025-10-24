"use client";

import { ReactNode, useRef } from "react";
import { usePathname } from "next/navigation";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AppNavigation } from "./app-navigation";
import { PageTransition } from "../ui/page-transition";
import { makeQueryClient } from "@/modules/lib/query-client";

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

  const queryClientRef = useRef(makeQueryClient());
  if (!queryClientRef.current) {
    queryClientRef.current = makeQueryClient();
  }

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  return (
    <QueryClientProvider client={queryClientRef.current}>
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
