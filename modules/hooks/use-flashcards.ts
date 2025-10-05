"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
} from "@/modules/api";
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
    onSuccess: () => {
      toast.success("Flashcard updated successfully");
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

  return {
    create: createMutation.mutateAsync,
    update: ({ cardId, data }: { cardId: number; data: UpdateFlashcardData }) =>
      updateMutation.mutateAsync({ cardId, data }),
    remove: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
