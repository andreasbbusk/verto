"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createSet, deleteSet, updateSet } from "@/modules/server/actions/sets";
import { queryKeys } from "@/modules/data/shared/queryKeys";
import type { FlashcardSet, UpdateSetData } from "@/modules/types/types";

export function useSetsMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createSet,
    onSuccess: (newSet) => {
      queryClient.setQueryData<FlashcardSet[]>(queryKeys.sets, (old) =>
        old ? [...old, newSet] : [newSet],
      );
      toast.success("Set created successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create set",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSetData }) =>
      updateSet(id, data),
    onMutate: async ({ id, data }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: queryKeys.sets }),
        queryClient.cancelQueries({ queryKey: queryKeys.setById(id) }),
      ]);

      const previousSets = queryClient.getQueryData<FlashcardSet[]>(
        queryKeys.sets,
      );
      const previousSet = queryClient.getQueryData<FlashcardSet>(
        queryKeys.setById(id),
      );

      const optimisticSet = previousSet
        ? {
            ...previousSet,
            ...data,
          }
        : undefined;

      if (previousSets) {
        queryClient.setQueryData<FlashcardSet[]>(
          queryKeys.sets,
          previousSets.map((set) =>
            set.id === id
              ? {
                  ...set,
                  ...data,
                }
              : set,
          ),
        );
      }

      if (optimisticSet) {
        queryClient.setQueryData(queryKeys.setById(id), optimisticSet);
      }

      return { previousSets, previousSet };
    },
    onError: (error, variables, context) => {
      if (context?.previousSets) {
        queryClient.setQueryData(queryKeys.sets, context.previousSets);
      }
      if (context?.previousSet) {
        queryClient.setQueryData(
          queryKeys.setById(variables.id),
          context.previousSet,
        );
      }
      toast.error(
        error instanceof Error ? error.message : "Failed to update set",
      );
    },
    onSuccess: (updatedSet, variables) => {
      queryClient.setQueryData(queryKeys.setById(variables.id), updatedSet);
      queryClient.setQueryData<FlashcardSet[]>(
        queryKeys.sets,
        (old) =>
          old?.map((set) => (set.id === variables.id ? updatedSet : set)) || [],
      );
      toast.success("Set updated successfully");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSet,
    onMutate: async (id: string) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: queryKeys.sets }),
        queryClient.cancelQueries({ queryKey: queryKeys.setById(id) }),
      ]);

      const previousSets = queryClient.getQueryData<FlashcardSet[]>(
        queryKeys.sets,
      );
      const previousSet = queryClient.getQueryData<FlashcardSet>(
        queryKeys.setById(id),
      );

      if (previousSets) {
        queryClient.setQueryData<FlashcardSet[]>(
          queryKeys.sets,
          previousSets.filter((set) => set.id !== id),
        );
      }

      queryClient.removeQueries({ queryKey: queryKeys.setById(id) });

      return { previousSets, previousSet };
    },
    onError: (error, id, context) => {
      if (context?.previousSets) {
        queryClient.setQueryData(queryKeys.sets, context.previousSets);
      }
      if (context?.previousSet) {
        queryClient.setQueryData(queryKeys.setById(id), context.previousSet);
      }
      toast.error(
        error instanceof Error ? error.message : "Failed to delete set",
      );
    },
    onSuccess: (deletedSet) => {
      queryClient.setQueryData<FlashcardSet[]>(
        queryKeys.sets,
        (old) => old?.filter((set) => set.id !== deletedSet.id) || [],
      );
      toast.success("Set deleted successfully");
    },
  });

  return {
    create: createMutation.mutateAsync,
    update: ({ id, data }: { id: string; data: UpdateSetData }) =>
      updateMutation.mutateAsync({ id, data }),
    remove: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
