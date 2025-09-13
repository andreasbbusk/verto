"use client";

import { useState, useEffect, useCallback } from "react";
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

interface UseFlashcardsReturn {
  flashcards: Flashcard[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (data: CreateFlashcardData) => Promise<Flashcard>;
  update: (id: string, data: UpdateFlashcardData) => Promise<Flashcard>;
  remove: (id: string) => Promise<void>;
}

export function useFlashcards(): UseFlashcardsReturn {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFlashcards();
      setFlashcards(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load flashcards"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(
    async (data: CreateFlashcardData): Promise<Flashcard> => {
      try {
        const response = await createFlashcard(data);
        const newFlashcard = response.data;
        setFlashcards((prev) => [...prev, newFlashcard]);
        return newFlashcard;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create flashcard";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    []
  );

  const update = useCallback(
    async (id: string, data: UpdateFlashcardData): Promise<Flashcard> => {
      try {
        const response = await updateFlashcard(id, data);
        const updatedFlashcard = response.data;
        setFlashcards((prev) =>
          prev.map((card) => (card.id === Number(id) ? updatedFlashcard : card))
        );
        return updatedFlashcard;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update flashcard";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    []
  );

  const remove = useCallback(async (id: string): Promise<void> => {
    try {
      await deleteFlashcard(id);
      setFlashcards((prev) => prev.filter((card) => card.id !== Number(id)));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete flashcard";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    flashcards,
    loading,
    error,
    refresh,
    create,
    update,
    remove,
  };
}

interface UseFlashcardsBySetReturn {
  flashcards: Flashcard[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useFlashcardsBySet(setName: string): UseFlashcardsBySetReturn {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!setName) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getFlashcardsBySet(setName);
      setFlashcards(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load flashcards"
      );
    } finally {
      setLoading(false);
    }
  }, [setName]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    flashcards,
    loading,
    error,
    refresh,
  };
}
