"use client";

import { useFlashcardMutations } from "@/modules/data/client/hooks/mutations/useFlashcards.client";
import { useProfileMutations } from "@/modules/data/client/hooks/mutations/useProfile.client";
import { profileQuery } from "@/modules/data/shared/profileQueryOptions";
import { queryKeys } from "@/modules/data/shared/queryKeys";
import { recordSetStudySession } from "@/modules/server/actions/sets";
import { useCardOrderStore } from "@/modules/stores/card-order.store";
import { useStudyProgressStore } from "@/modules/stores/study-progress.store";
import type { Flashcard, FlashcardSet, SetStats } from "@/modules/types/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface UseStudySessionOptions {
  flashcards: Flashcard[];
  setId: string;
  setDifficulty: number;
  onFlashcardUpdate?: (flashcard: Flashcard) => void;
}

interface StudySessionState {
  currentIndex: number;
  isFlipped: boolean;
  earmarkLabel: string;
  filterStarredOnly: boolean;
  exitAlertOpen: boolean;
  displayCards: Flashcard[];
  currentCard: Flashcard | null;
}

interface StudySessionActions {
  goToNext: () => void;
  goToPrevious: () => void;
  jumpToCard: (index: number) => void;
  shuffleCards: () => void;
  toggleStarredFilter: () => void;
  handleResetProgress: () => void;
  handleFlipCard: () => void;
  finishStudy: () => Promise<void>;
  exitStudy: () => void;
  setExitAlertOpen: (open: boolean) => void;
}

export function useStudySession({
  flashcards,
  setId,
  setDifficulty,
  onFlashcardUpdate,
}: UseStudySessionOptions): {
  state: StudySessionState;
  actions: StudySessionActions;
  isFinishing: boolean;
} {
  const router = useRouter();
  const { data: profile } = useQuery(profileQuery());
  const profileMutations = useProfileMutations();
  const flashcardMutations = useFlashcardMutations(setId);
  const queryClient = useQueryClient();
  const { getProgress, saveProgress, clearProgress } = useStudyProgressStore();
  const { getCardOrder } = useCardOrderStore();
  const flipLabelTimeoutRef = useRef<number | null>(null);

  const orderedFlashcards = useMemo(() => {
    if (!setId) return flashcards;

    const savedOrder = getCardOrder(setId);
    if (!savedOrder || savedOrder.length === 0) return flashcards;

    const cardMap = new Map(flashcards.map((card) => [card.id, card]));
    const validOrder = savedOrder.filter((id) => cardMap.has(id));
    const orderedCards = validOrder.map((id) => cardMap.get(id)!);
    const newCards = flashcards.filter((card) => !validOrder.includes(card.id));

    return [...orderedCards, ...newCards];
  }, [flashcards, getCardOrder, setId]);

  const savedProgress = getProgress(setId);
  const initialIndex =
    savedProgress !== null && savedProgress < orderedFlashcards.length
      ? savedProgress
      : 0;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isFlipped, setIsFlipped] = useState(false);
  const [earmarkLabel, setEarmarkLabel] = useState("Front");
  const [customOrder, setCustomOrder] = useState<string[] | null>(null);
  const [cardOverrides, setCardOverrides] = useState<Record<string, Flashcard>>(
    {}
  );
  const [filterStarredOnly, setFilterStarredOnly] = useState(false);
  const [exitAlertOpen, setExitAlertOpen] = useState(false);

  useEffect(() => {
    return () => {
      if (flipLabelTimeoutRef.current) {
        window.clearTimeout(flipLabelTimeoutRef.current);
      }
    };
  }, []);

  const studyCards = useMemo(() => {
    const cardMap = new Map(orderedFlashcards.map((card) => [card.id, card]));
    const ordered = customOrder
      ? customOrder
          .map((id) => cardMap.get(id))
          .filter((card): card is Flashcard => Boolean(card))
      : orderedFlashcards;
    const missing = customOrder
      ? orderedFlashcards.filter((card) => !customOrder.includes(card.id))
      : [];

    return [...ordered, ...missing].map(
      (card) => cardOverrides[card.id] ?? card
    );
  }, [cardOverrides, customOrder, orderedFlashcards]);

  const displayCards = useMemo(() => {
    if (!filterStarredOnly) {
      return studyCards;
    }

    return studyCards.filter((card) => card.starred);
  }, [filterStarredOnly, studyCards]);

  const safeIndex = useMemo(() => {
    if (displayCards.length === 0) return 0;
    return Math.min(currentIndex, displayCards.length - 1);
  }, [currentIndex, displayCards.length]);

  useEffect(() => {
    if (displayCards.length > 0) {
      saveProgress(setId, safeIndex, displayCards.length);
    }
  }, [displayCards.length, safeIndex, saveProgress, setId]);

  const buildReviewedCard = useCallback(
    (card: Flashcard) => ({
      ...card,
      reviewCount: card.reviewCount + 1,
      performance: {
        ...card.performance,
        lastReviewed: new Date().toISOString(),
        nextReview: new Date(
          Date.now() + setDifficulty * 24 * 60 * 60 * 1000
        ).toISOString(),
        repetitions: (card.performance?.repetitions || 0) + 1,
        easeFactor: card.performance?.easeFactor || 2.5,
        interval: setDifficulty,
      },
    }),
    [setDifficulty]
  );

  const goToNext = useCallback(() => {
    if (studyCards.length === 0) return;

    if (isFlipped) {
      const currentCard = studyCards[safeIndex];
      if (currentCard) {
        const updatedCard = buildReviewedCard(currentCard);

        setCardOverrides((prev) => ({
          ...prev,
          [currentCard.id]: updatedCard,
        }));

        flashcardMutations
          .update({
            cardId: currentCard.id,
            data: {
              reviewCount: updatedCard.reviewCount,
              performance: updatedCard.performance,
            },
          })
          .catch(() => undefined);

        onFlashcardUpdate?.(updatedCard);
      }
    }

    const nextIndex = Math.min(safeIndex + 1, studyCards.length - 1);
    if (nextIndex !== safeIndex) {
      setCurrentIndex(nextIndex);
      setIsFlipped(false);
    }
  }, [
    studyCards,
    safeIndex,
    isFlipped,
    buildReviewedCard,
    flashcardMutations,
    onFlashcardUpdate,
  ]);

  const goToPrevious = useCallback(() => {
    if (studyCards.length > 0) {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
      setIsFlipped(false);
    }
  }, [studyCards.length]);

  const jumpToCard = useCallback(
    (index: number) => {
      if (index >= 0 && index < studyCards.length) {
        setCurrentIndex(index);
        setIsFlipped(false);
      }
    },
    [studyCards.length]
  );

  const shuffleCards = useCallback(() => {
    const shuffled = [...studyCards].sort(() => Math.random() - 0.5);
    setCustomOrder(shuffled.map((card) => card.id));
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [studyCards]);

  const toggleStarredFilter = useCallback(() => {
    setFilterStarredOnly((prev) => !prev);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, []);

  const handleResetProgress = useCallback(() => {
    clearProgress(setId);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [clearProgress, setId]);

  const handleFlipCard = useCallback(() => {
    setIsFlipped((prev) => !prev);
    if (flipLabelTimeoutRef.current) {
      window.clearTimeout(flipLabelTimeoutRef.current);
    }
    flipLabelTimeoutRef.current = window.setTimeout(() => {
      setEarmarkLabel((prev) => (prev === "Front" ? "Back" : "Front"));
      flipLabelTimeoutRef.current = null;
    }, 400);
  }, []);

  const exitStudy = useCallback(() => {
    if (displayCards.length > 0) {
      saveProgress(setId, safeIndex, displayCards.length);
    }

    if (setId) {
      router.push(`/sets/${setId}`);
      return;
    }

    router.push("/sets");
  }, [router, setId, safeIndex, displayCards.length, saveProgress]);

  const finishStudy = useCallback(async () => {
    const cardsStudied = displayCards.length;

    if (isFlipped && displayCards.length > 0) {
      const currentCard = displayCards[currentIndex];
      if (currentCard) {
        const updatedCard = buildReviewedCard(currentCard);
        flashcardMutations
          .update({
            cardId: currentCard.id,
            data: {
              reviewCount: updatedCard.reviewCount,
              performance: updatedCard.performance,
            },
          })
          .catch(() => undefined);
      }
    }

    if (cardsStudied > 0 && profile) {
      try {
        const profileStats = profile.stats ?? {
          totalStudySessions: 0,
          totalCardsStudied: 0,
          currentStreak: 0,
          longestStreak: 0,
        };

        const updatedProfile = await profileMutations.updateStats({
          totalStudySessions: profileStats.totalStudySessions + 1,
          totalCardsStudied: profileStats.totalCardsStudied + cardsStudied,
          lastStudiedAt: new Date().toISOString(),
        });

        if (setId) {
          const setStats = await recordSetStudySession(setId);
          const applySetStats = (existing?: FlashcardSet) => {
            if (!existing) return existing;
            return {
              ...existing,
              stats: {
                ...(existing.stats ?? {}),
                ...setStats,
              } as SetStats,
            };
          };

          queryClient.setQueryData(queryKeys.setById(setId), applySetStats);
          queryClient.setQueryData(
            queryKeys.sets,
            (existing?: FlashcardSet[]) =>
              existing?.map((set) =>
                set.id === setId ? applySetStats(set) ?? set : set
              )
          );
          queryClient.invalidateQueries({ queryKey: queryKeys.setById(setId) });
          queryClient.invalidateQueries({ queryKey: queryKeys.sets });
        }

        queryClient.setQueryData(queryKeys.me, updatedProfile);
      } catch (error) {
        return;
      }
    }

    exitStudy();
  }, [
    displayCards,
    currentIndex,
    isFlipped,
    buildReviewedCard,
    flashcardMutations,
    profile,
    profileMutations,
    exitStudy,
    queryClient,
    setId,
  ]);

  const currentCard = displayCards[safeIndex] ?? null;

  return {
    state: {
      currentIndex,
      isFlipped,
      earmarkLabel,
      filterStarredOnly,
      exitAlertOpen,
      displayCards,
      currentCard,
    },
    actions: {
      goToNext,
      goToPrevious,
      jumpToCard,
      shuffleCards,
      toggleStarredFilter,
      handleResetProgress,
      handleFlipCard,
      finishStudy,
      exitStudy,
      setExitAlertOpen,
    },
    isFinishing:
      profileMutations.isUpdating || profileMutations.isUpdatingStats,
  };
}
