"use client";

import { useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { useFlashcardMutations } from "@/modules/data/client/hooks/mutations/useFlashcards.client";
import { useSetsMutations } from "@/modules/data/client/hooks/mutations/useSets.client";
import type {
  CreateFlashcardData,
  CreateSetData,
  Flashcard,
  FlashcardSet,
  UpdateFlashcardData,
} from "@/modules/types/types";

interface UseSetDetailActionsOptions {
  setId: string;
  set: FlashcardSet | null | undefined;
  editingCard: Flashcard | null;
  onOpenCreateCard: () => void;
}

export function useSetDetailActions({
  setId,
  set,
  editingCard,
  onOpenCreateCard,
}: UseSetDetailActionsOptions) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const flashcardMutations = useFlashcardMutations(setId);
  const { update: updateSet, remove: removeSet } = useSetsMutations();

  const shouldOpenCreateCard = searchParams.get("createCard") === "true";

  useEffect(() => {
    if (shouldOpenCreateCard) {
      onOpenCreateCard();
    }
  }, [shouldOpenCreateCard, onOpenCreateCard]);

  const handleUpdateSet = useCallback(
    async (data: CreateSetData) => {
      if (!set) return;

      try {
        await updateSet({ id: setId, data });
      } catch (error) {
        toast.error("Failed to update set");
        throw error;
      }
    },
    [set, setId, updateSet],
  );

  const handleDeleteSet = useCallback(async () => {
    if (!set) return;

    if (
      !confirm(
        `Are you sure you want to delete the set "${set.name}" and all its flashcards?`,
      )
    ) {
      return;
    }

    try {
      await removeSet(setId);
      router.push("/sets");
    } catch (error) {
      toast.error("Failed to delete set");
    }
  }, [set, removeSet, router, setId]);

  const handleBulkCreateCards = useCallback(
    async (cards: Omit<CreateFlashcardData, "setId">[]) => {
      if (!set) return;
      await flashcardMutations.createBulk(cards);
    },
    [set, flashcardMutations],
  );

  const handleCardFormSubmit = useCallback(
    async (data: CreateFlashcardData | UpdateFlashcardData) => {
      if (!set) return;

      if (editingCard) {
        await flashcardMutations.update({
          cardId: editingCard.id,
          data: data as UpdateFlashcardData,
        });
        return;
      }

      await flashcardMutations.create(data as CreateFlashcardData);
    },
    [set, editingCard, flashcardMutations],
  );

  const handleDeleteCard = useCallback(
    async (flashcard: Flashcard) => {
      await flashcardMutations.remove(flashcard.id);
    },
    [flashcardMutations],
  );

  const handleToggleStar = useCallback(
    async (flashcard: Flashcard) => {
      await flashcardMutations.update({
        cardId: flashcard.id,
        data: { starred: !flashcard.starred },
      });
    },
    [flashcardMutations],
  );

  return {
    flashcardMutations,
    handleUpdateSet,
    handleDeleteSet,
    handleBulkCreateCards,
    handleCardFormSubmit,
    handleDeleteCard,
    handleToggleStar,
  };
}
