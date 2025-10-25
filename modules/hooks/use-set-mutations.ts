"use client";

import { updateSet, deleteSet } from "@/modules/actions/sets";
import type { UpdateSetData } from "@/modules/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Hook for set-level mutations (update, delete)
 * Used when working with a specific set (e.g., in SetDetailView)
 */
export function useSetMutations(setId: number) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: UpdateSetData) => updateSet(setId, data),
    onSuccess: (updatedSet) => {
      // Update the specific set cache
      queryClient.setQueryData(['sets', setId], updatedSet);
      // Update the sets list cache
      queryClient.invalidateQueries({ queryKey: ['sets'] });
      toast.success("Set updated successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update set");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteSet(setId),
    onSuccess: () => {
      // Remove from sets list cache
      queryClient.invalidateQueries({ queryKey: ['sets'] });
      toast.success("Set deleted successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete set");
    },
  });

  return {
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
