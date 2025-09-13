"use client";

import { useState, useEffect, useCallback } from "react";
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

interface UseSetsReturn {
  sets: FlashcardSet[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (data: CreateSetData) => Promise<FlashcardSet>;
  update: (id: string, data: UpdateSetData) => Promise<FlashcardSet>;
  remove: (id: string) => Promise<void>;
}

export function useSets(): UseSetsReturn {
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSets();
      setSets(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load sets"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(
    async (data: CreateSetData): Promise<FlashcardSet> => {
      try {
        const response = await createSet(data);
        const newSet = response.data;
        setSets((prev) => [...prev, newSet]);
        return newSet;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create set";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    []
  );

  const update = useCallback(
    async (id: string, data: UpdateSetData): Promise<FlashcardSet> => {
      try {
        const response = await updateSet(id, data);
        const updatedSet = response.data;
        setSets((prev) =>
          prev.map((set) => (set.id === Number(id) ? updatedSet : set))
        );
        return updatedSet;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update set";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    []
  );

  const remove = useCallback(async (id: string): Promise<void> => {
    try {
      await deleteSet(id);
      setSets((prev) => prev.filter((set) => set.id !== Number(id)));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete set";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    sets,
    loading,
    error,
    refresh,
    create,
    update,
    remove,
  };
}