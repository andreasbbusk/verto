"use client";

import { Badge } from "@/modules/components/ui/badge";
import { Button } from "@/modules/components/ui/button";
import { cn } from "@/modules/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Settings,
  Shuffle,
  Star,
} from "lucide-react";

interface StudyControlsProps {
  currentIndex: number;
  totalCards: number;
  isFlipped: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onFlip: () => void;
  onExit: () => void;
  onFinish?: () => void;
  onShuffle?: () => void;
  onSettings?: () => void;
  onModeChange?: () => void;
  filterStarredOnly?: boolean;
  onToggleStarredFilter?: () => void;
  onResetProgress?: () => void;
  isFinishing?: boolean;
  className?: string;
}

export function StudyControls({
  currentIndex,
  totalCards,
  isFlipped,
  onPrevious,
  onNext,
  onFlip,
  onExit,
  onFinish,
  onShuffle,
  onSettings,
  onModeChange,
  filterStarredOnly = false,
  onToggleStarredFilter,
  onResetProgress,
  isFinishing = false,
  className,
}: StudyControlsProps) {
  const isFirstCard = currentIndex === 0;
  const isLastCard = currentIndex === totalCards - 1;

  return (
    <div className={cn("w-full", className)}>
      <div className="space-y-3">
        {/* Primary Navigation */}
        <div className="flex items-center justify-center gap-4">
          <Button
              variant="outline"
              size="lg"
              onClick={onPrevious}
              disabled={totalCards <= 1 || isFirstCard}
              className="flex-1 max-w-32"
            >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex flex-col items-center gap-2 min-w-28">
            <Button
              variant={isFlipped ? "secondary" : "default"}
              size="lg"
              onClick={onFlip}
              className="w-full"
            >
              {isFlipped ? "Front" : "Flip"}
            </Button>
            <Badge
              variant="outline"
              className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/20"
            >
              {currentIndex + 1} / {totalCards}
            </Badge>
          </div>

          {isLastCard ? (
            <Button
              variant="default"
              size="lg"
              onClick={onFinish ?? onExit}
              disabled={isFinishing}
              className="flex-1 max-w-32"
            >
              {isFinishing ? "Finishing..." : "Finish"}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="lg"
              onClick={onNext}
              disabled={totalCards <= 1}
              className="flex-1 max-w-32"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </div>

        <div className="text-center text-xs text-muted-foreground">
          Click the card or use ↑ ↓ to flip
        </div>

        {/* Secondary Controls */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExit}
              title="End study session"
              className="border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              End session
            </Button>

            {onResetProgress && (
              <Button
                variant="outline"
                size="sm"
                onClick={onResetProgress}
                title="Start from beginning (R)"
                className="gap-1.5"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="text-xs hidden sm:inline">Reset</span>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onShuffle && (
              <Button
                variant="outline"
                size="sm"
                onClick={onShuffle}
                title="Shuffle cards"
              >
                <Shuffle className="h-4 w-4" />
              </Button>
            )}

            {onToggleStarredFilter && (
              <Button
                variant={filterStarredOnly ? "default" : "outline"}
                size="sm"
                onClick={onToggleStarredFilter}
                title={
                  filterStarredOnly ? "Show all cards" : "Show favorites only"
                }
                className="gap-1.5"
              >
                <Star
                  className="h-4 w-4"
                  fill={filterStarredOnly ? "currentColor" : "none"}
                />
                <span className="text-xs hidden sm:inline">Filter</span>
              </Button>
            )}

            {onSettings && (
              <Button
                variant="outline"
                size="sm"
                onClick={onSettings}
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
