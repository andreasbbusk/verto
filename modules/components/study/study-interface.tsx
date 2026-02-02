"use client";

import { useEffect, useRef } from "react";
import { FlashcardCard } from "@/modules/components/flashcards/card/flashcard-card";
import type { Flashcard } from "@/modules/types/types";
import { StudyEmptyState } from "./components/study-empty-state";
import { StudyExitDialog } from "./components/study-exit-dialog";
import { StudyFooter } from "./components/study-footer";
import { StudyHeader } from "./components/study-header";
import { useStudyKeyboardNavigation } from "./hooks/use-study-keyboard-navigation";
import { useStudySession } from "./hooks/use-study-session";

interface StudyInterfaceProps {
  flashcards: Flashcard[];
  setName: string;
  setDifficulty?: number;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const { state, actions, isFinishing } = useStudySession({
    flashcards,
    setId,
    setDifficulty,
    onFlashcardUpdate,
  });

  const {
    currentIndex,
    isFlipped,
    earmarkLabel,
    filterStarredOnly,
    exitAlertOpen,
    displayCards,
    currentCard,
  } = state;

  const {
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
  } = actions;

  useStudyKeyboardNavigation({
    onPrevious: goToPrevious,
    onNext: goToNext,
    onFlip: handleFlipCard,
    isDialogOpen: exitAlertOpen,
  });

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!exitAlertOpen && containerRef.current) {
      containerRef.current.focus();
    }
  }, [exitAlertOpen]);

  if (displayCards.length === 0) {
    return (
      <StudyEmptyState
        filterStarredOnly={filterStarredOnly}
        onShowAll={toggleStarredFilter}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="flex flex-col outline-none -m-6 h-[calc(100vh-6rem)]"
    >
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 flex flex-col overflow-auto">
        <StudyHeader
          setName={setName}
          filterStarredOnly={filterStarredOnly}
          currentIndex={currentIndex}
          totalCards={displayCards.length}
          onProgressClick={jumpToCard}
        />

        <div className="flex-1 flex items-center justify-center">
          <FlashcardCard
            flashcard={currentCard}
            isFlipped={isFlipped}
            onFlip={handleFlipCard}
            earmarkNumber={currentIndex + 1}
            earmarkLabel={earmarkLabel}
            className="w-full max-w-2xl"
          />
        </div>
      </div>

      <StudyFooter
        currentIndex={currentIndex}
        totalCards={displayCards.length}
        isFlipped={isFlipped}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onFlip={handleFlipCard}
        onExit={() => setExitAlertOpen(true)}
        onFinish={finishStudy}
        onShuffle={shuffleCards}
        filterStarredOnly={filterStarredOnly}
        onToggleStarredFilter={toggleStarredFilter}
        onResetProgress={handleResetProgress}
        isFinishing={isFinishing}
      />

      <StudyExitDialog
        open={exitAlertOpen}
        onOpenChange={setExitAlertOpen}
        onExit={exitStudy}
      />
    </div>
  );
}
