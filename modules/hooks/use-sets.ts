"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getSets,
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
};

export function useSets() {
  const queryClient = useQueryClient();
  
  const query = useQuery({
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
    mutationFn: ({ id, data }: { id: string; data: UpdateSetData }) =>
      updateSet(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.sets });
      const previousSets = queryClient.getQueryData<FlashcardSet[]>(queryKeys.sets);
      
      queryClient.setQueryData<FlashcardSet[]>(queryKeys.sets, (old) =>
        old?.map((set) => 
          set.id === Number(id) ? { ...set, ...data } : set
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
        old?.filter((set) => set.id !== Number(id)) || []
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
    sets: query.data || [],
    loading: query.isPending,
    error: query.error?.message || null,
    refresh: () => queryClient.invalidateQueries({ queryKey: queryKeys.sets }),
    create: createMutation.mutateAsync,
    update: ({ id, data }: { id: string; data: UpdateSetData }) => 
      updateMutation.mutateAsync({ id, data }),
    remove: deleteMutation.mutateAsync,
  };
}