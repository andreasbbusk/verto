"use client";

import { useState } from "react";
import { Button } from "@/modules/components/ui/button";
import { Badge } from "@/modules/components/ui/badge";
import { Kbd, KbdGroup } from "@/modules/components/ui/kbd";
import { cn } from "@/modules/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Home,
  Shuffle,
  Settings,
  Play,
  Pause,
  Star,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface StudyControlsProps {
  currentIndex: number;
  totalCards: number;
  isFlipped: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onFlip: () => void;
  onExit: () => void;
  onShuffle?: () => void;
  onSettings?: () => void;
  onModeChange?: () => void;
  autoPlayEnabled?: boolean;
  onToggleAutoPlay?: () => void;
  filterStarredOnly?: boolean;
  onToggleStarredFilter?: () => void;
  onResetProgress?: () => void;
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
  onShuffle,
  onSettings,
  onModeChange,
  autoPlayEnabled = false,
  onToggleAutoPlay,
  filterStarredOnly = false,
  onToggleStarredFilter,
  onResetProgress,
  className,
}: StudyControlsProps) {
  const [showShortcuts, setShowShortcuts] = useState(false);
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
              disabled={totalCards <= 1}
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

            <Button
              variant={isLastCard ? "default" : "outline"}
              size="lg"
              onClick={onNext}
              disabled={totalCards <= 1}
              className="flex-1 max-w-32"
            >
              {isLastCard ? (
                <span className="text-sm font-medium">Afslut</span>
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Secondary Controls */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onExit}
                title="Return to sets"
                className="border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Home className="h-4 w-4" />
              </Button>

              {onResetProgress && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onResetProgress}
                  title="Start fra begyndelsen (R)"
                  className="gap-1.5"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span className="text-xs hidden sm:inline">Nulstil</span>
                </Button>
              )}
            </div>


            <div className="flex items-center gap-2">
              {onToggleAutoPlay && (
                <Button
                  variant={autoPlayEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={onToggleAutoPlay}
                  title={autoPlayEnabled ? "Stop auto-play" : "Start auto-play"}
                >
                  {autoPlayEnabled ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              )}

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
                  title={filterStarredOnly ? "Vis alle kort" : "Vis kun favoritter"}
                  className="gap-1.5"
                >
                  <Star className="h-4 w-4" fill={filterStarredOnly ? "currentColor" : "none"} />
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

          {/* Keyboard shortcuts toggle */}
          <div className="flex justify-center border-t border-border/50 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowShortcuts(!showShortcuts)}
              className="text-xs text-muted-foreground hover:text-foreground gap-1.5 h-7"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              Keyboard Shortcuts
              {showShortcuts ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </Button>
          </div>

          {/* Keyboard shortcuts hint */}
          {showShortcuts && (
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground pt-3">
            <KbdGroup className="flex items-center gap-1.5">
              <Kbd>←</Kbd>
              <Kbd>→</Kbd>
              Navigate
            </KbdGroup>
            <KbdGroup className="flex items-center gap-1.5">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              <Kbd>Space</Kbd>
              Flip
            </KbdGroup>
            <KbdGroup className="flex items-center gap-1.5">
              <Kbd>E</Kbd>
              Edit
            </KbdGroup>
            <KbdGroup className="flex items-center gap-1.5">
              <Kbd>F</Kbd>
              Star
            </KbdGroup>
            <KbdGroup className="flex items-center gap-1.5">
              <Kbd>R</Kbd>
              Nulstil
            </KbdGroup>
            <KbdGroup className="flex items-center gap-1.5">
              <Kbd>S</Kbd>
              Shuffle
            </KbdGroup>
            </div>
          )}
      </div>
    </div>
  );
}
