"use client";

import { StudyControls } from "../study-controls";

interface StudyFooterProps {
  currentIndex: number;
  totalCards: number;
  isFlipped: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onFlip: () => void;
  onExit: () => void;
  onFinish: () => void | Promise<void>;
  onShuffle: () => void;
  filterStarredOnly: boolean;
  onToggleStarredFilter: () => void;
  onResetProgress: () => void;
  isFinishing: boolean;
}

export function StudyFooter({
  currentIndex,
  totalCards,
  isFlipped,
  onPrevious,
  onNext,
  onFlip,
  onExit,
  onFinish,
  onShuffle,
  filterStarredOnly,
  onToggleStarredFilter,
  onResetProgress,
  isFinishing,
}: StudyFooterProps) {
  return (
    <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border shadow-[0_-8px_20px_-16px_rgba(255,252,242,0.9)] z-10">
      <div className="max-w-5xl mx-auto px-6 py-3">
        <StudyControls
          currentIndex={currentIndex}
          totalCards={totalCards}
          isFlipped={isFlipped}
          onPrevious={onPrevious}
          onNext={onNext}
          onFlip={onFlip}
          onExit={onExit}
          onFinish={onFinish}
          isFinishing={isFinishing}
          onShuffle={onShuffle}
          filterStarredOnly={filterStarredOnly}
          onToggleStarredFilter={onToggleStarredFilter}
          onResetProgress={onResetProgress}
        />
      </div>
    </div>
  );
}

export type { StudyFooterProps };
