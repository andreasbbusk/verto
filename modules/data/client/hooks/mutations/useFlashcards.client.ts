"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
  createFlashcardsBulk,
} from "@/modules/server/actions/flashcards";
import { queryKeys } from "@/modules/data/shared/queryKeys";
import type {
  CreateFlashcardData,
  UpdateFlashcardData,
} from "@/modules/types/types";

export function useFlashcardMutations(setId: string) {
  const queryClient = useQueryClient();

  const invalidateCaches = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.flashcardsBySet(setId),
    });
    queryClient.invalidateQueries({ queryKey: queryKeys.setById(setId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.sets });
  };

  const createMutation = useMutation({
    mutationFn: (flashcard: Omit<CreateFlashcardData, "setId">) =>
      createFlashcard(setId, flashcard),
    onSuccess: () => {
      toast.success("Flashcard created successfully");
      invalidateCaches();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create flashcard",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      cardId,
      data,
    }: {
      cardId: string;
      data: UpdateFlashcardData;
    }) => updateFlashcard(setId, cardId, data),
    onSuccess: (_, variables) => {
      if (
        !(
          "starred" in variables.data &&
          Object.keys(variables.data).length === 1
        )
      ) {
        toast.success("Flashcard updated successfully");
      }
      invalidateCaches();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update flashcard",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (cardId: string) => deleteFlashcard(setId, cardId),
    onSuccess: () => {
      toast.success("Flashcard deleted successfully");
      invalidateCaches();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete flashcard",
      );
    },
  });

  const createBulkMutation = useMutation({
    mutationFn: (flashcards: Omit<CreateFlashcardData, "setId">[]) =>
      createFlashcardsBulk(setId, flashcards),
    onSuccess: (result) => {
      if (result.failureCount > 0) {
        toast.warning(
          `Created ${result.successCount} flashcard(s), ${result.failureCount} failed`,
        );
      } else {
        toast.success(
          `Successfully created ${result.successCount} flashcard(s)`,
        );
      }
      invalidateCaches();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create flashcards",
      );
    },
  });

  return {
    create: createMutation.mutateAsync,
    update: ({ cardId, data }: { cardId: string; data: UpdateFlashcardData }) =>
      updateMutation.mutateAsync({ cardId, data }),
    remove: deleteMutation.mutateAsync,
    createBulk: createBulkMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isCreatingBulk: createBulkMutation.isPending,
  };
}
