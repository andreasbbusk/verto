"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import FlashcardComponent from "@/modules/components/flashcards/flashcard";
import { ProgressBar } from "./progress-bar";
import { StudyControls } from "./study-controls";
import { QuickEditDialog } from "./quick-edit-dialog";
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
import { toast } from "sonner";
import type { Flashcard } from "@/modules/types/types";
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
  const { getProgress, saveProgress, clearProgress } = useStudyProgressStore();
  const { getCardOrder } = useCardOrderStore();

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
  const [studyCards, setStudyCards] = useState(orderedFlashcards);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [filterStarredOnly, setFilterStarredOnly] = useState(false);
  const [exitAlertOpen, setExitAlertOpen] = useState(false);

  const flashcardMutations = useFlashcardMutations(setId);

  useEffect(() => {
    setStudyCards(orderedFlashcards);
    setCurrentIndex((prev) =>
      Math.min(prev, Math.max(orderedFlashcards.length - 1, 0)),
    );
  }, [orderedFlashcards]);

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
    if (!editDialogOpen && !exitAlertOpen && containerRef.current) {
      containerRef.current.focus();
    }
  }, [editDialogOpen, exitAlertOpen]);

  // Save progress whenever currentIndex changes
  useEffect(() => {
    if (displayCards.length > 0) {
      saveProgress(setId, currentIndex, displayCards.length);
    }
  }, [currentIndex, displayCards.length, setId, saveProgress]);

  const goToNext = useCallback(() => {
    if (studyCards.length > 0) {
      // Record that the current card was viewed if it was flipped
      if (isFlipped) {
        const currentCard = studyCards[currentIndex];

        // Simple spaced repetition - just increment review count and use set difficulty
        const updatedCard = {
          ...currentCard,
          reviewCount: currentCard.reviewCount + 1,
          performance: {
            ...currentCard.performance,
            lastReviewed: new Date().toISOString(),
            nextReview: new Date(
              Date.now() + setDifficulty * 24 * 60 * 60 * 1000,
            ).toISOString(),
            repetitions: (currentCard.performance?.repetitions || 0) + 1,
            easeFactor: currentCard.performance?.easeFactor || 2.5,
            interval: setDifficulty,
          },
        } as Flashcard;

        // Update the cards array with the new data
        setStudyCards((prev) =>
          prev.map((card, idx) => (idx === currentIndex ? updatedCard : card)),
        );

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
  }, [studyCards, currentIndex, isFlipped, setDifficulty, onFlashcardUpdate]);

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

  const handleFlipCard = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleToggleStar = useCallback(
    async (flashcard: Flashcard) => {
      try {
        const updatedCard = await flashcardMutations.update({
          cardId: flashcard.id,
          data: { starred: !flashcard.starred },
        });

        setStudyCards((prev) =>
          prev.map((card) => (card.id === flashcard.id ? updatedCard : card)),
        );

        toast.success(
          updatedCard.starred ? "Added to favorites" : "Removed from favorites",
        );
      } catch (error) {
        toast.error("Could not update flashcard");
        console.error(error);
      }
    },
    [flashcardMutations],
  );

  const handleEdit = useCallback(() => {
    setEditDialogOpen(true);
  }, []);

  const handleSaveEdit = useCallback(
    async (flashcard: Flashcard, updates: { front: string; back: string }) => {
      try {
        const updatedCard = await flashcardMutations.update({
          cardId: flashcard.id,
          data: updates,
        });

        setStudyCards((prev) =>
          prev.map((card) => (card.id === flashcard.id ? updatedCard : card)),
        );

        toast.success("Flashcard updated");
      } catch (error) {
        toast.error("Could not update flashcard");
        console.error(error);
        throw error;
      }
    },
    [flashcardMutations],
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore keyboard shortcuts when typing in textarea
      const target = event.target as HTMLElement;
      if (target.tagName === "TEXTAREA" || target.tagName === "INPUT") {
        return;
      }

      if (editDialogOpen || exitAlertOpen) return;

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
    editDialogOpen,
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
            onEdit={handleEdit}
            onToggleStar={() => handleToggleStar(currentCard)}
            showEditButton={true}
            className="w-full max-w-2xl"
          />
        </div>
      </div>

      {/* Controls - Sticky at bottom */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg z-10">
        <div className="max-w-5xl mx-auto px-6 py-3">
          <StudyControls
            currentIndex={currentIndex}
            totalCards={displayCards.length}
            isFlipped={isFlipped}
            onPrevious={goToPrevious}
            onNext={goToNext}
            onFlip={handleFlipCard}
            onExit={() => setExitAlertOpen(true)}
            onShuffle={shuffleCards}
            filterStarredOnly={filterStarredOnly}
            onToggleStarredFilter={toggleStarredFilter}
            onResetProgress={handleResetProgress}
          />
        </div>
      </div>

      {/* Quick Edit Dialog */}
      <QuickEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        flashcard={currentCard}
        onSave={handleSaveEdit}
      />

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
