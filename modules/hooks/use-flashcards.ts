"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getFlashcards,
  getFlashcardsBySet,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
} from "@/modules/api";
import type {
  Flashcard,
  CreateFlashcardData,
  UpdateFlashcardData,
} from "@/modules/types";

// Query keys for consistent cache management
const queryKeys = {
  flashcards: ['flashcards'] as const,
  flashcardsBySet: (setName: string) => ['flashcards', 'set', setName] as const,
};

export function useFlashcards() {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: queryKeys.flashcards,
    queryFn: getFlashcards,
  });

  const createMutation = useMutation({
    mutationFn: createFlashcard,
    onMutate: async (newFlashcard) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.flashcards });
      const previousFlashcards = queryClient.getQueryData<Flashcard[]>(queryKeys.flashcards);
      
      queryClient.setQueryData<Flashcard[]>(queryKeys.flashcards, (old) => 
        old ? [...old, { ...newFlashcard, id: Date.now() } as Flashcard] : []
      );
      
      return { previousFlashcards };
    },
    onError: (err, newFlashcard, context) => {
      queryClient.setQueryData(queryKeys.flashcards, context?.previousFlashcards);
    },
    onSuccess: (data) => {
      toast.success("Flashcard created successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.flashcards });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFlashcardData }) =>
      updateFlashcard(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.flashcards });
      const previousFlashcards = queryClient.getQueryData<Flashcard[]>(queryKeys.flashcards);
      
      queryClient.setQueryData<Flashcard[]>(queryKeys.flashcards, (old) =>
        old?.map((card) => 
          card.id === Number(id) ? { ...card, ...data } : card
        ) || []
      );
      
      return { previousFlashcards };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(queryKeys.flashcards, context?.previousFlashcards);
    },
    onSuccess: () => {
      toast.success("Flashcard updated successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.flashcards });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFlashcard,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.flashcards });
      const previousFlashcards = queryClient.getQueryData<Flashcard[]>(queryKeys.flashcards);
      
      queryClient.setQueryData<Flashcard[]>(queryKeys.flashcards, (old) =>
        old?.filter((card) => card.id !== Number(id)) || []
      );
      
      return { previousFlashcards };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(queryKeys.flashcards, context?.previousFlashcards);
    },
    onSuccess: () => {
      toast.success("Flashcard deleted successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.flashcards });
    },
  });

  return {
    flashcards: query.data || [],
    loading: query.isPending,
    error: query.error?.message || null,
    refresh: () => queryClient.invalidateQueries({ queryKey: queryKeys.flashcards }),
    create: createMutation.mutateAsync,
    update: ({ id, data }: { id: string; data: UpdateFlashcardData }) => 
      updateMutation.mutateAsync({ id, data }),
    remove: deleteMutation.mutateAsync,
  };
}

export function useFlashcardsBySet(setName: string) {
  const query = useQuery({
    queryKey: queryKeys.flashcardsBySet(setName),
    queryFn: () => getFlashcardsBySet(setName),
    enabled: !!setName,
  });

  return {
    flashcards: query.data || [],
    loading: query.isPending,
    error: query.error?.message || null,
    refresh: () => query.refetch(),
  };
}
