"use client";

import { ProgressBar } from "../progress-bar";

interface StudyHeaderProps {
  setName: string;
  filterStarredOnly: boolean;
  currentIndex: number;
  totalCards: number;
  onProgressClick: (index: number) => void;
}

export function StudyHeader({
  setName,
  filterStarredOnly,
  currentIndex,
  totalCards,
  onProgressClick,
}: StudyHeaderProps) {
  return (
    <div className="text-center p-2">
      <h1 className="text-xl font-semibold text-foreground mb-3">
        {setName}
        {filterStarredOnly && (
          <span className="text-sm text-muted-foreground ml-2">(★ Favorites)</span>
        )}
      </h1>
      <ProgressBar
        current={currentIndex}
        total={totalCards}
        onProgressClick={onProgressClick}
      />
    </div>
  );
}

export type { StudyHeaderProps };
