"use client";

import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getSets,
  getSetById,
  createSet,
  updateSet,
  deleteSet,
} from "@/modules/api";
import type {
  FlashcardSet,
  CreateSetData,
  UpdateSetData,
} from "@/modules/types";

const queryKeys = {
  sets: ['sets'] as const,
  setById: (id: number) => ['sets', id] as const,
};

export function useSets() {
  const queryClient = useQueryClient();

  const query = useSuspenseQuery({
    queryKey: queryKeys.sets,
    queryFn: getSets,
  });

  const createMutation = useMutation({
    mutationFn: createSet,
    onMutate: async (newSet) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.sets });
      const previousSets = queryClient.getQueryData<FlashcardSet[]>(queryKeys.sets);
      
      queryClient.setQueryData<FlashcardSet[]>(queryKeys.sets, (old) => 
        old ? [...old, { ...newSet, id: Date.now() } as FlashcardSet] : []
      );
      
      return { previousSets };
    },
    onError: (err, newSet, context) => {
      queryClient.setQueryData(queryKeys.sets, context?.previousSets);
    },
    onSuccess: () => {
      toast.success("Set created successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.sets });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSetData }) =>
      updateSet(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.sets });
      const previousSets = queryClient.getQueryData<FlashcardSet[]>(queryKeys.sets);

      queryClient.setQueryData<FlashcardSet[]>(queryKeys.sets, (old) =>
        old?.map((set) =>
          set.id === id ? { ...set, ...data } : set
        ) || []
      );

      return { previousSets };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(queryKeys.sets, context?.previousSets);
    },
    onSuccess: () => {
      toast.success("Set updated successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.sets });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSet,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.sets });
      const previousSets = queryClient.getQueryData<FlashcardSet[]>(queryKeys.sets);

      queryClient.setQueryData<FlashcardSet[]>(queryKeys.sets, (old) =>
        old?.filter((set) => set.id !== id) || []
      );

      return { previousSets };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(queryKeys.sets, context?.previousSets);
    },
    onSuccess: () => {
      toast.success("Set deleted successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.sets });
    },
  });

  return {
    sets: query.data ?? [],
    error: query.error?.message || null,
    refresh: () => queryClient.invalidateQueries({ queryKey: queryKeys.sets }),
    create: createMutation.mutateAsync,
    update: ({ id, data }: { id: number; data: UpdateSetData }) =>
      updateMutation.mutateAsync({ id, data }),
    remove: deleteMutation.mutateAsync,
  };
}

export function useSetById(id: number) {
  const queryClient = useQueryClient();

  const query = useSuspenseQuery({
    queryKey: queryKeys.setById(id),
    queryFn: () => getSetById(id),
  });

  return {
    set: query.data,
    flashcards: query.data?.flashcards || [],
    error: query.error?.message || null,
    refresh: () => queryClient.invalidateQueries({ queryKey: queryKeys.setById(id) }),
  };
}