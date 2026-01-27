import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function makeQueryClient() {
  return new QueryClient({
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
  });
}
