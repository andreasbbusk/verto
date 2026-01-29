"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import FlashcardComponent from "@/modules/components/flashcards/flashcard";
import { ProgressBar } from "./progress-bar";
import { StudyControls } from "./study-controls";
import { Card, CardContent } from "@/modules/components/ui/card";
import { Button } from "@/modules/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/modules/components/ui/alert-dialog";
import type { Flashcard } from "@/modules/types/types";
import { useQuery } from "@tanstack/react-query";
import { profileQuery } from "@/modules/data/shared/profileQueryOptions";
import { useProfileMutations } from "@/modules/data/client/hooks/mutations/useProfile.client";
import { useFlashcardMutations } from "@/modules/data/client/hooks/mutations/useFlashcards.client";
import { useStudyProgressStore } from "@/modules/stores/study-progress.store";
import { useCardOrderStore } from "@/modules/stores/card-order.store";

interface StudyInterfaceProps {
  flashcards: Flashcard[];
  setName: string;
  setDifficulty?: number; // Set-level difficulty (1-5)
  setId: string;
  onFlashcardUpdate?: (flashcard: Flashcard) => void;
}

export function StudyInterface({
  flashcards,
  setName,
  setDifficulty = 3,
  setId,
  onFlashcardUpdate,
}: StudyInterfaceProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const flipLabelTimeoutRef = useRef<number | null>(null);
  const { getProgress, saveProgress, clearProgress } = useStudyProgressStore();
  const { getCardOrder } = useCardOrderStore();
  const { data: profile } = useQuery(profileQuery());
  const profileMutations = useProfileMutations();
  const flashcardMutations = useFlashcardMutations(setId);

  const orderedFlashcards = useMemo(() => {
    if (!setId) return flashcards;

    const savedOrder = getCardOrder(setId);
    if (!savedOrder || savedOrder.length === 0) return flashcards;

    const cardMap = new Map(flashcards.map((card) => [card.id, card]));
    const validOrder = savedOrder.filter((id) => cardMap.has(id));
    const orderedCards = validOrder.map((id) => cardMap.get(id)!);
    const newCards = flashcards.filter((card) => !validOrder.includes(card.id));

    return [...orderedCards, ...newCards];
  }, [flashcards, setId, getCardOrder]);

  // Initialize from saved progress or start at 0
  const savedProgress = getProgress(setId);
  const initialIndex =
    savedProgress !== null && savedProgress < orderedFlashcards.length
      ? savedProgress
      : 0;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isFlipped, setIsFlipped] = useState(false);
  const [earmarkLabel, setEarmarkLabel] = useState("Front");
  const [studyCards, setStudyCards] = useState(orderedFlashcards);
  const [filterStarredOnly, setFilterStarredOnly] = useState(false);
  const [exitAlertOpen, setExitAlertOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStudyCards(orderedFlashcards);
    setCurrentIndex((prev) =>
      Math.min(prev, Math.max(orderedFlashcards.length - 1, 0)),
    );
  }, [orderedFlashcards]);

  useEffect(() => {
    return () => {
      if (flipLabelTimeoutRef.current) {
        window.clearTimeout(flipLabelTimeoutRef.current);
      }
    };
  }, []);

  // Apply starred filter
  const displayCards = filterStarredOnly
    ? studyCards.filter((card) => card.starred)
    : studyCards;

  const toggleStarredFilter = useCallback(() => {
    setFilterStarredOnly((prev) => !prev);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, []);

  // Auto-focus container on mount
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Restore focus after dialogs close
  useEffect(() => {
    if (!exitAlertOpen && containerRef.current) {
      containerRef.current.focus();
    }
  }, [exitAlertOpen]);

  // Save progress whenever currentIndex changes
  useEffect(() => {
    if (displayCards.length > 0) {
      saveProgress(setId, currentIndex, displayCards.length);
    }
  }, [currentIndex, displayCards.length, setId, saveProgress]);

  const buildReviewedCard = useCallback(
    (card: Flashcard) => ({
      ...card,
      reviewCount: card.reviewCount + 1,
      performance: {
        ...card.performance,
        lastReviewed: new Date().toISOString(),
        nextReview: new Date(
          Date.now() + setDifficulty * 24 * 60 * 60 * 1000,
        ).toISOString(),
        repetitions: (card.performance?.repetitions || 0) + 1,
        easeFactor: card.performance?.easeFactor || 2.5,
        interval: setDifficulty,
      },
    }),
    [setDifficulty],
  );

  const goToNext = useCallback(() => {
    if (studyCards.length > 0) {
      // Record that the current card was viewed if it was flipped
      if (isFlipped) {
        const currentCard = studyCards[currentIndex];

        // Simple spaced repetition - just increment review count and use set difficulty
        const updatedCard = buildReviewedCard(currentCard);

        // Update the cards array with the new data
        setStudyCards((prev) =>
          prev.map((card, idx) => (idx === currentIndex ? updatedCard : card)),
        );

        flashcardMutations
          .update({
            cardId: currentCard.id,
            data: {
              reviewCount: updatedCard.reviewCount,
              performance: updatedCard.performance,
            },
          })
          .catch(() => {
            // Error toast handled in mutation
          });

        // Call the optional update handler
        if (onFlashcardUpdate) {
          onFlashcardUpdate(updatedCard);
        }
      }

      const nextIndex = Math.min(currentIndex + 1, studyCards.length - 1);
      if (nextIndex !== currentIndex) {
        setCurrentIndex(nextIndex);
        setIsFlipped(false);
      }
    }
  }, [studyCards, currentIndex, isFlipped, buildReviewedCard, onFlashcardUpdate, flashcardMutations]);

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
    [studyCards.length],
  );

  const shuffleCards = useCallback(() => {
    const shuffled = [...studyCards].sort(() => Math.random() - 0.5);
    setStudyCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [studyCards]);

  const handleResetProgress = useCallback(() => {
    // Clear saved progress and reset to first card
    clearProgress(setId);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [clearProgress, setId]);

  const exitStudy = useCallback(() => {
    // Save final progress before exiting
    if (displayCards.length > 0) {
      saveProgress(setId, currentIndex, displayCards.length);
    }

    // Navigate back to the set detail page
    if (setId) {
      router.push(`/sets/${setId}`);
    } else {
      router.push("/sets");
    }
  }, [router, setId, currentIndex, displayCards.length, saveProgress]);

  const finishStudy = useCallback(async () => {
    const cardsStudied = displayCards.length;

    if (isFlipped && displayCards.length > 0) {
      const currentCard = displayCards[currentIndex];
      const updatedCard = buildReviewedCard(currentCard);

      flashcardMutations
        .update({
          cardId: currentCard.id,
          data: {
            reviewCount: updatedCard.reviewCount,
            performance: updatedCard.performance,
          },
        })
        .catch(() => {
          // Error toast handled in mutation
        });
    }

    if (cardsStudied > 0 && profile) {
      try {
        await profileMutations.update({
          totalStudySessions: profile.totalStudySessions + 1,
          totalCardsStudied: profile.totalCardsStudied + cardsStudied,
        });
      } catch (error) {
        // Errors are handled in the mutation hook
      }
    }

    exitStudy();
  }, [displayCards, currentIndex, isFlipped, buildReviewedCard, flashcardMutations, profile, profileMutations, exitStudy]);

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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore keyboard shortcuts when typing in textarea
      const target = event.target as HTMLElement;
      if (target.tagName === "TEXTAREA" || target.tagName === "INPUT") {
        return;
      }

      if (exitAlertOpen) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPrevious();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goToNext();
      } else if (
        event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === " "
      ) {
        event.preventDefault();
        handleFlipCard();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    goToNext,
    goToPrevious,
    handleFlipCard,
    exitAlertOpen,
  ]);

  if (displayCards.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-foreground">
                  {filterStarredOnly
                    ? "No starred flashcards"
                    : "No flashcards"}
                </h3>
                <p className="text-muted-foreground">
                  {filterStarredOnly
                    ? "No cards are marked as favorites yet"
                    : "This set contains no cards to study"}
                </p>
              </div>
              {filterStarredOnly && (
                <Button variant="outline" onClick={toggleStarredFilter}>
                  Show all cards
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentCard = displayCards[currentIndex];

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="flex flex-col outline-none -m-6 h-[calc(100vh-6rem)]"
    >
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 flex flex-col overflow-auto">
        {/* Header */}
        <div className="text-center p-2">
          <h1 className="text-xl font-semibold text-foreground mb-3">
            {setName}
            {filterStarredOnly && (
              <span className="text-sm text-muted-foreground ml-2">
                (★ Favorites)
              </span>
            )}
          </h1>
          <ProgressBar
            current={currentIndex}
            total={displayCards.length}
            onProgressClick={jumpToCard}
          />
        </div>

        {/* Flashcard - centered with more top spacing */}
        <div className="flex-1 flex items-center justify-center">
            <FlashcardComponent
              flashcard={currentCard}
              isFlipped={isFlipped}
              onFlip={handleFlipCard}
              earmarkNumber={currentIndex + 1}
              earmarkLabel={earmarkLabel}
              className="w-full max-w-2xl"
            />
        </div>
      </div>

      {/* Controls - Sticky at bottom */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border shadow-[0_-8px_20px_-16px_rgba(255,252,242,0.9)] z-10">
        <div className="max-w-5xl mx-auto px-6 py-3">
            <StudyControls
              currentIndex={currentIndex}
              totalCards={displayCards.length}
              isFlipped={isFlipped}
              onPrevious={goToPrevious}
              onNext={goToNext}
              onFlip={handleFlipCard}
              onExit={() => setExitAlertOpen(true)}
              onFinish={finishStudy}
              isFinishing={profileMutations.isUpdating}
              onShuffle={shuffleCards}
              filterStarredOnly={filterStarredOnly}
              onToggleStarredFilter={toggleStarredFilter}
              onResetProgress={handleResetProgress}
            />
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={exitAlertOpen} onOpenChange={setExitAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End study session?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to end this study session and return to the
              set?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep studying</AlertDialogCancel>
            <AlertDialogAction onClick={exitStudy}>
              End session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
