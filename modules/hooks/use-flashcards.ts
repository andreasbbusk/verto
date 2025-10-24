"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
  createFlashcardsBulk,
} from "@/modules/lib/api-client";
import type {
  CreateFlashcardData,
  UpdateFlashcardData,
} from "@/modules/types";

export function useFlashcardMutations(setId: number) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (flashcard: Omit<CreateFlashcardData, 'setId'>) =>
      createFlashcard(setId, flashcard),
    onSuccess: () => {
      toast.success("Flashcard created successfully");
      queryClient.invalidateQueries({ queryKey: ['sets', setId] });
      queryClient.invalidateQueries({ queryKey: ['sets'] });
    },
    onError: (error) => {
      toast.error("Failed to create flashcard");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ cardId, data }: { cardId: number; data: UpdateFlashcardData }) =>
      updateFlashcard(setId, cardId, data),
    onSuccess: (_, variables) => {
      // Only show toast if it's not just a star toggle
      if (!('starred' in variables.data && Object.keys(variables.data).length === 1)) {
        toast.success("Flashcard updated successfully");
      }
      queryClient.invalidateQueries({ queryKey: ['sets', setId] });
    },
    onError: (error) => {
      toast.error("Failed to update flashcard");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (cardId: number) => deleteFlashcard(setId, cardId),
    onSuccess: () => {
      toast.success("Flashcard deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['sets', setId] });
      queryClient.invalidateQueries({ queryKey: ['sets'] });
    },
    onError: (error) => {
      toast.error("Failed to delete flashcard");
    },
  });

  const createBulkMutation = useMutation({
    mutationFn: (flashcards: Omit<CreateFlashcardData, 'setId'>[]) =>
      createFlashcardsBulk(setId, flashcards),
    onSuccess: (response) => {
      const result = response.data;
      if (result.failureCount > 0) {
        toast.warning(
          `Created ${result.successCount} flashcard(s), ${result.failureCount} failed`
        );
      } else {
        toast.success(`Successfully created ${result.successCount} flashcard(s)`);
      }
      queryClient.invalidateQueries({ queryKey: ['sets', setId] });
      queryClient.invalidateQueries({ queryKey: ['sets'] });
    },
    onError: (error) => {
      toast.error("Failed to create flashcards");
    },
  });

  return {
    create: createMutation.mutateAsync,
    update: ({ cardId, data }: { cardId: number; data: UpdateFlashcardData }) =>
      updateMutation.mutateAsync({ cardId, data }),
    remove: deleteMutation.mutateAsync,
    createBulk: createBulkMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isCreatingBulk: createBulkMutation.isPending,
  };
}
