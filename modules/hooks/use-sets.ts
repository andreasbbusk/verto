"use client";

import {
  createSet,
  deleteSet,
  getSetById,
  getSets,
  updateSet,
} from "@/modules/actions/sets";
import type { FlashcardSet, UpdateSetData } from "@/modules/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const queryKeys = {
  sets: ["sets"] as const,
  setById: (id: string) => ["sets", id] as const,
};

export function useSets(initialSets?: FlashcardSet[]) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.sets,
    queryFn: getSets,
    initialData: initialSets,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes to prevent duplicate fetches
  });

  const createMutation = useMutation({
    mutationFn: createSet,
    onSuccess: (newSet) => {
      queryClient.setQueryData<FlashcardSet[]>(queryKeys.sets, (old) =>
        old ? [...old, newSet] : [newSet]
      );
      toast.success("Set created successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create set"
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSetData }) =>
      updateSet(id, data),
    onSuccess: (updatedSet, variables) => {
      queryClient.setQueryData<FlashcardSet[]>(
        queryKeys.sets,
        (old) =>
          old?.map((set) => (set.id === variables.id ? updatedSet : set)) || []
      );
      toast.success("Set updated successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update set"
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSet,
    onSuccess: (deletedSet) => {
      queryClient.setQueryData<FlashcardSet[]>(
        queryKeys.sets,
        (old) => old?.filter((set) => set.id !== deletedSet.id) || []
      );
      toast.success("Set deleted successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete set"
      );
    },
  });

  return {
    sets: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message || null,
    refresh: () => queryClient.invalidateQueries({ queryKey: queryKeys.sets }),
    create: createMutation.mutateAsync,
    update: ({ id, data }: { id: string; data: UpdateSetData }) =>
      updateMutation.mutateAsync({ id, data }),
    remove: deleteMutation.mutateAsync,
  };
}

export function useSetById(id: string, initialSet?: FlashcardSet) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.setById(id),
    queryFn: () => getSetById(id),
    initialData: initialSet,
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes to prevent duplicate fetches
  });

  return {
    set: query.data,
    flashcards: query.data?.flashcards || [],
    isLoading: query.isLoading,
    error: query.error?.message || null,
    refresh: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.setById(id) }),
  };
}
