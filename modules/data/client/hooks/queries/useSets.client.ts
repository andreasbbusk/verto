"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/modules/data/shared/queryKeys";
import { setByIdQuery, setsQuery } from "@/modules/data/shared/setsQueryOptions";

export function useSets() {
  const queryClient = useQueryClient();

  const query = useQuery(setsQuery());

  return {
    sets: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message || null,
    refresh: () => queryClient.invalidateQueries({ queryKey: queryKeys.sets }),
  };
}

export function useSetById(id: string) {
  const queryClient = useQueryClient();

  const query = useQuery(setByIdQuery(id));

  return {
    set: query.data,
    flashcards: query.data?.flashcards || [],
    isLoading: query.isLoading,
    error: query.error?.message || null,
    refresh: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.setById(id) }),
  };
}

export function usePrefetchSetById() {
  const queryClient = useQueryClient();

  return (id: string) => {
    if (!id) return;
    return queryClient.prefetchQuery(setByIdQuery(id));
  };
}
