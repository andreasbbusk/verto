"use client";

import { Button } from "@/modules/components/ui/button";
import { Card, CardContent } from "@/modules/components/ui/card";
import { Badge } from "@/modules/components/ui/badge";
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
} from "lucide-react";

interface StudyControlsProps {
  currentIndex: number;
  totalCards: number;
  isFlipped: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onFlip: () => void;
  onReset: () => void;
  onExit: () => void;
  onShuffle?: () => void;
  onSettings?: () => void;
  onModeChange?: () => void;
  autoPlayEnabled?: boolean;
  onToggleAutoPlay?: () => void;
  className?: string;
}

export function StudyControls({
  currentIndex,
  totalCards,
  isFlipped,
  onPrevious,
  onNext,
  onFlip,
  onReset,
  onExit,
  onShuffle,
  onSettings,
  onModeChange,
  autoPlayEnabled = false,
  onToggleAutoPlay,
  className,
}: StudyControlsProps) {
  const isFirstCard = currentIndex === 0;
  const isLastCard = currentIndex === totalCards - 1;

  return (
    <Card
      className={cn(
        "w-full bg-card/80 backdrop-blur-sm border border-border",
        className
      )}
    >
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Primary Navigation */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={onPrevious}
              disabled={totalCards <= 1}
              className="flex-1 max-w-40 transition-all duration-200"
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Previous
            </Button>

            <div className="flex flex-col items-center gap-3 min-w-32">
              <Button
                variant={isFlipped ? "secondary" : "default"}
                size="lg"
                onClick={onFlip}
                className="w-full"
              >
                {isFlipped ? "Show Front" : "Flip Card"}
              </Button>
              <Badge
                variant="outline"
                className="text-sm px-3 py-1 bg-primary/10 text-primary border-primary/20"
              >
                {currentIndex + 1} / {totalCards}
              </Badge>
            </div>

            <Button
              variant="outline"
              size="lg"
              onClick={onNext}
              disabled={totalCards <= 1}
              className="flex-1 max-w-40 transition-all duration-200"
            >
              Next
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </div>

          {/* Secondary Controls */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onExit}
                title="Return to dashboard"
                className="border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
              >
                <Home className="h-4 w-4 mr-2" />
                Exit
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                title="Start over"
                className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            <div className="flex items-center gap-3">
              {onToggleAutoPlay && (
                <Button
                  variant={autoPlayEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={onToggleAutoPlay}
                  title={autoPlayEnabled ? "Stop auto-play" : "Start auto-play"}
                  className={
                    autoPlayEnabled
                      ? "transition-all duration-200"
                      : "border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                  }
                >
                  {autoPlayEnabled ? (
                    <Pause className="h-4 w-4 mr-2" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  Auto
                </Button>
              )}

              {onShuffle && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onShuffle}
                  title="Shuffle cards"
                  className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                >
                  <Shuffle className="h-4 w-4 mr-2" />
                  Shuffle
                </Button>
              )}

              {onSettings && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSettings}
                  title="Settings"
                  className="transition-all duration-200"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Keyboard shortcuts hint */}
          <div className="text-center text-sm text-muted-foreground border-t border-border/50 pt-4">
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded-md text-xs font-mono">
                  ←
                </kbd>
                <kbd className="px-2 py-1 bg-muted rounded-md text-xs font-mono">
                  →
                </kbd>
                <span className="text-xs">Navigate</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded-md text-xs font-mono">
                  ↑
                </kbd>
                <kbd className="px-2 py-1 bg-muted rounded-md text-xs font-mono">
                  ↓
                </kbd>
                <kbd className="px-2 py-1 bg-muted rounded-md text-xs font-mono">
                  Space
                </kbd>
                <span className="text-xs">Flip</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded-md text-xs font-mono">
                  Esc
                </kbd>
                <span className="text-xs">Exit</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded-md text-xs font-mono">
                  S
                </kbd>
                <span className="text-xs">Shuffle</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
