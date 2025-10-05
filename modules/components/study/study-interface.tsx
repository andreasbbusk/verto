"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import FlashcardComponent from "@/modules/components/flashcards/flashcard";
import { ProgressBar } from "./progress-bar";
import { StudyControls } from "./study-controls";
import { Card, CardContent } from "@/modules/components/ui/card";
import type { Flashcard } from "@/modules/types";

interface StudyInterfaceProps {
  flashcards: Flashcard[];
  setName: string;
  setDifficulty?: number; // Set-level difficulty (1-5)
  onFlashcardUpdate?: (flashcard: Flashcard) => void;
}

export function StudyInterface({
  flashcards,
  setName,
  setDifficulty = 3,
  onFlashcardUpdate,
}: StudyInterfaceProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);
  const [studyCards, setStudyCards] = useState(flashcards);
  const [showResults, setShowResults] = useState(false);
  const [cardStartTime, setCardStartTime] = useState<Date>(new Date());

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
  }, [flashcards]);

  const exitStudy = useCallback(() => {
    router.push("/sets");
  }, [router]);

  const handleFlipCard = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showResults) return;

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
      } else if (event.key === "Escape") {
        event.preventDefault();
        exitStudy();
      } else if (event.key === "r" || event.key === "R") {
        event.preventDefault();
        resetStudy();
      } else if (event.key === "s" || event.key === "S") {
        event.preventDefault();
        shuffleCards();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    goToNext,
    goToPrevious,
    exitStudy,
    resetStudy,
    shuffleCards,
    showResults,
    handleFlipCard,
  ]);

  if (studyCards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="text-muted-foreground text-4xl">📚</div>
              <div>
                <h3 className="font-semibold text-lg text-foreground">Ingen flashcards</h3>
                <p className="text-muted-foreground">
                  Dette set indeholder ingen kort at studere
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentCard = studyCards[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="text-center bg-card/80 backdrop-blur-sm rounded-lg p-8 border border-border">
          <h1 className="text-heading-2 font-bold text-foreground mb-4">
            {setName}
          </h1>
          <ProgressBar
            current={currentIndex}
            total={studyCards.length}
            onProgressClick={jumpToCard}
          />
        </div>

        {/* Flashcard */}
        <div className="flex justify-center">
          <FlashcardComponent
            flashcard={currentCard}
            isFlipped={isFlipped}
            onFlip={handleFlipCard}
            className="w-full max-w-lg"
          />
        </div>

        {/* Controls */}
        <StudyControls
          currentIndex={currentIndex}
          totalCards={studyCards.length}
          isFlipped={isFlipped}
          onPrevious={goToPrevious}
          onNext={goToNext}
          onFlip={handleFlipCard}
          onReset={resetStudy}
          onExit={exitStudy}
          onShuffle={shuffleCards}
          autoPlayEnabled={autoPlayEnabled}
          onToggleAutoPlay={() => setAutoPlayEnabled((prev) => !prev)}
        />

        {/* Study Stats */}
        <Card className="bg-card/80 backdrop-blur-sm border border-border">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-body-sm text-muted-foreground">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full" />
                    <span className="font-medium">
                      Progress:{" "}
                      {Math.round(
                        ((currentIndex + 1) / studyCards.length) * 100
                      )}
                      %
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary/60 rounded-full" />
                    <span>
                      Remaining: {studyCards.length - currentIndex - 1}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  {autoPlayEnabled && (
                    <div className="flex items-center gap-2 text-primary">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <span className="font-medium">Auto-play active</span>
                    </div>
                  )}
                  <span className="font-medium">
                    Total: {studyCards.length} cards
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
