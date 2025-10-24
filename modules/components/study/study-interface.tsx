"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import FlashcardComponent from "@/modules/components/flashcards/flashcard";
import { ProgressBar } from "./progress-bar";
import { StudyControls } from "./study-controls";
import { QuickEditDialog } from "./quick-edit-dialog";
import { Card, CardContent } from "@/modules/components/ui/card";
import { Button } from "@/modules/components/ui/button";
import { Badge } from "@/modules/components/ui/badge";
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
import type { Flashcard } from "@/modules/types";
import { updateFlashcard } from "@/modules/actions/flashcards";
import { useStudyProgressStore } from "@/modules/stores/studyProgressStore";

interface StudyInterfaceProps {
  flashcards: Flashcard[];
  setName: string;
  setDifficulty?: number; // Set-level difficulty (1-5)
  setId: number;
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

  // Initialize from saved progress or start at 0
  const savedProgress = getProgress(setId);
  const initialIndex =
    savedProgress !== null && savedProgress < flashcards.length
      ? savedProgress
      : 0;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);
  const [studyCards, setStudyCards] = useState(flashcards);
  const [showResults, setShowResults] = useState(false);
  const [cardStartTime, setCardStartTime] = useState<Date>(new Date());
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [filterStarredOnly, setFilterStarredOnly] = useState(false);
  const [exitAlertOpen, setExitAlertOpen] = useState(false);
  const [resetAlertOpen, setResetAlertOpen] = useState(false);
  const [cardsReviewed, setCardsReviewed] = useState(new Set<number>());

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
    if (
      !editDialogOpen &&
      !exitAlertOpen &&
      !resetAlertOpen &&
      containerRef.current
    ) {
      containerRef.current.focus();
    }
  }, [editDialogOpen, exitAlertOpen, resetAlertOpen]);

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
        const responseTime = new Date().getTime() - cardStartTime.getTime();

        // Simple spaced repetition - just increment review count and use set difficulty
        const updatedCard = {
          ...currentCard,
          reviewCount: currentCard.reviewCount + 1,
          performance: {
            ...currentCard.performance,
            lastReviewed: new Date(),
            nextReview: new Date(
              Date.now() + setDifficulty * 24 * 60 * 60 * 1000
            ), // Next review in [difficulty] days
            repetitions: (currentCard.performance?.repetitions || 0) + 1,
            easeFactor: currentCard.performance?.easeFactor || 2.5,
            interval: setDifficulty,
          },
        };

        // Update the cards array with the new data
        setStudyCards((prev) =>
          prev.map((card, idx) => (idx === currentIndex ? updatedCard : card))
        );

        // Call the optional update handler
        if (onFlashcardUpdate) {
          onFlashcardUpdate(updatedCard);
        }
      }

      const nextIndex = (currentIndex + 1) % studyCards.length;

      // If we've completed all cards, show results
      if (nextIndex === 0 && currentIndex === studyCards.length - 1) {
        setShowResults(true);
        return;
      }

      setCurrentIndex(nextIndex);
      setIsFlipped(false);
      setCardStartTime(new Date());
    }
  }, [
    studyCards,
    currentIndex,
    isFlipped,
    cardStartTime,
    setDifficulty,
    onFlashcardUpdate,
  ]);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlayEnabled || studyCards.length <= 1) return;

    const interval = setInterval(() => {
      if (isFlipped) {
        // Move to next card after showing back
        goToNext();
      } else {
        // Flip to back after showing front
        setIsFlipped(true);
      }
    }, 3000); // 3 seconds per side

    return () => clearInterval(interval);
  }, [autoPlayEnabled, isFlipped, currentIndex, studyCards.length, goToNext]);

  const goToPrevious = useCallback(() => {
    if (studyCards.length > 0) {
      setCurrentIndex(
        (prev) => (prev - 1 + studyCards.length) % studyCards.length
      );
      setIsFlipped(false);
      setCardStartTime(new Date());
    }
  }, [studyCards.length]);

  const jumpToCard = useCallback(
    (index: number) => {
      if (index >= 0 && index < studyCards.length) {
        setCurrentIndex(index);
        setIsFlipped(false);
        setCardStartTime(new Date());
      }
    },
    [studyCards.length]
  );

  const shuffleCards = useCallback(() => {
    const shuffled = [...studyCards].sort(() => Math.random() - 0.5);
    setStudyCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setCardStartTime(new Date());
  }, [studyCards]);

  const resetStudy = useCallback(() => {
    setStudyCards(flashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setAutoPlayEnabled(false);
    setShowResults(false);
    setCardStartTime(new Date());
    setCardsReviewed(new Set());
  }, [flashcards]);

  const handleResetProgress = useCallback(() => {
    // Clear saved progress and reset to first card
    clearProgress(setId);
    setCurrentIndex(0);
    setIsFlipped(false);
    setResetAlertOpen(false);
    setCardsReviewed(new Set());
    toast.success("Fremskridt nulstillet");
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
    setIsFlipped((prev) => {
      // Track card as reviewed when flipping to back side
      if (!prev) {
        setCardsReviewed((reviewed) => new Set(reviewed).add(currentIndex));
      }
      return !prev;
    });
  }, [currentIndex]);

  const handleToggleStar = useCallback(async (flashcard: Flashcard) => {
    try {
      const updatedCard = await updateFlashcard(flashcard.setId, flashcard.id, {
        starred: !flashcard.starred,
      });

      setStudyCards((prev) =>
        prev.map((card) => (card.id === flashcard.id ? updatedCard : card))
      );

      toast.success(
        updatedCard.starred
          ? "Tilføjet til favoritter"
          : "Fjernet fra favoritter"
      );
    } catch (error) {
      toast.error("Kunne ikke opdatere flashcard");
      console.error(error);
    }
  }, []);

  const handleEdit = useCallback(() => {
    setEditDialogOpen(true);
  }, []);

  const handleSaveEdit = useCallback(
    async (flashcard: Flashcard, updates: { front: string; back: string }) => {
      try {
        const updatedCard = await updateFlashcard(
          flashcard.setId,
          flashcard.id,
          updates
        );

        setStudyCards((prev) =>
          prev.map((card) => (card.id === flashcard.id ? updatedCard : card))
        );

        toast.success("Flashcard opdateret");
      } catch (error) {
        toast.error("Kunne ikke opdatere flashcard");
        console.error(error);
        throw error;
      }
    },
    []
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore keyboard shortcuts when typing in textarea
      const target = event.target as HTMLElement;
      if (target.tagName === "TEXTAREA" || target.tagName === "INPUT") {
        return;
      }

      if (showResults || editDialogOpen || exitAlertOpen || resetAlertOpen)
        return;

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
      } else if (event.key === "r" || event.key === "R") {
        event.preventDefault();
        setResetAlertOpen(true);
      } else if (event.key === "s" || event.key === "S") {
        event.preventDefault();
        shuffleCards();
      } else if (event.key === "e" || event.key === "E") {
        event.preventDefault();
        handleEdit();
      } else if (event.key === "f" || event.key === "F") {
        event.preventDefault();
        handleToggleStar(studyCards[currentIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    goToNext,
    goToPrevious,
    shuffleCards,
    showResults,
    handleFlipCard,
    editDialogOpen,
    exitAlertOpen,
    resetAlertOpen,
    handleEdit,
    handleToggleStar,
    studyCards,
    currentIndex,
  ]);

  if (displayCards.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="text-muted-foreground text-4xl">📚</div>
              <div>
                <h3 className="font-semibold text-lg text-foreground">
                  {filterStarredOnly
                    ? "Ingen stjernede flashcards"
                    : "Ingen flashcards"}
                </h3>
                <p className="text-muted-foreground">
                  {filterStarredOnly
                    ? "Ingen kort er markeret som favoritter endnu"
                    : "Dette set indeholder ingen kort at studere"}
                </p>
              </div>
              {filterStarredOnly && (
                <Button variant="outline" onClick={toggleStarredFilter}>
                  Vis alle kort
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
                (★ Favoritter)
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
            autoPlayEnabled={autoPlayEnabled}
            onToggleAutoPlay={() => setAutoPlayEnabled((prev) => !prev)}
            filterStarredOnly={filterStarredOnly}
            onToggleStarredFilter={toggleStarredFilter}
            onResetProgress={() => setResetAlertOpen(true)}
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
            <AlertDialogTitle>Afslut studiesession?</AlertDialogTitle>
            <AlertDialogDescription>
              Er du sikker på, at du vil afslutte denne studiesession og vende
              tilbage til settet?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Fortsæt med at studere</AlertDialogCancel>
            <AlertDialogAction onClick={exitStudy}>
              Afslut session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Progress Confirmation Dialog */}
      <AlertDialog open={resetAlertOpen} onOpenChange={setResetAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start forfra?</AlertDialogTitle>
            <AlertDialogDescription>
              Dit fremskridt i dette set vil blive nulstillet, og du starter fra
              det første kort.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuller</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetProgress}>
              Start forfra
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Completion Dialog */}
      <AlertDialog open={showResults} onOpenChange={setShowResults}>
        <AlertDialogContent asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center text-3xl font-bold">
                {(() => {
                  const percentage = Math.round((cardsReviewed.size / displayCards.length) * 100);
                  if (percentage === 100) return "Fantastisk arbejde!";
                  if (percentage >= 80) return "Flot klaret!";
                  return "Godt gået!";
                })()}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center space-y-6 pt-6">
                <div>
                  <div className="text-lg text-foreground mb-2">
                    Du har gennemført studiesessionen
                  </div>
                  <div className="text-muted-foreground text-sm">{setName}</div>
                </div>

                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
                  <div className="text-center space-y-3">
                    <div className="text-5xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
                      {Math.round((cardsReviewed.size / displayCards.length) * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {cardsReviewed.size} af {displayCards.length} kort gennemgået
                    </div>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2 mt-4 sm:justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  resetStudy();
                  setShowResults(false);
                }}
              >
                Studér igen
              </Button>
              <Button onClick={exitStudy}>
                Afslut session
              </Button>
            </AlertDialogFooter>
          </motion.div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
