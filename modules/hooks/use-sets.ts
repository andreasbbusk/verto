"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  getSets,
  getSetById,
  createSet,
  updateSet,
  deleteSet,
} from "@/modules/lib/api-client";
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
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.sets,
    queryFn: getSets,
    enabled: !!session?.user,
  });

  const createMutation = useMutation({
    mutationFn: createSet,
    onSuccess: (response) => {
      if (response.success && response.data) {
        queryClient.setQueryData<FlashcardSet[]>(queryKeys.sets, (old) =>
          old ? [...old, response.data] : [response.data]
        );
        toast.success("Set created successfully");
      }
    },
    onError: () => {
      toast.error("Failed to create set");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSetData }) =>
      updateSet(id, data),
    onSuccess: (response, variables) => {
      if (response.success && response.data) {
        queryClient.setQueryData<FlashcardSet[]>(queryKeys.sets, (old) =>
          old?.map((set) =>
            set.id === variables.id ? response.data : set
          ) || []
        );
        toast.success("Set updated successfully");
      }
    },
    onError: () => {
      toast.error("Failed to update set");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSet,
    onSuccess: (response, id) => {
      if (response.success) {
        queryClient.setQueryData<FlashcardSet[]>(queryKeys.sets, (old) =>
          old?.filter((set) => set.id !== id) || []
        );
        toast.success("Set deleted successfully");
      }
    },
    onError: () => {
      toast.error("Failed to delete set");
    },
  });

  return {
    sets: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message || null,
    refresh: () => queryClient.invalidateQueries({ queryKey: queryKeys.sets }),
    create: createMutation.mutateAsync,
    update: ({ id, data }: { id: number; data: UpdateSetData }) =>
      updateMutation.mutateAsync({ id, data }),
    remove: deleteMutation.mutateAsync,
  };
}

export function useSetById(id: number) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.setById(id),
    queryFn: () => getSetById(id),
    enabled: !!session?.user && !!id,
  });

  return {
    set: query.data,
    flashcards: query.data?.flashcards || [],
    isLoading: query.isLoading,
    error: query.error?.message || null,
    refresh: () => queryClient.invalidateQueries({ queryKey: queryKeys.setById(id) }),
  };
}