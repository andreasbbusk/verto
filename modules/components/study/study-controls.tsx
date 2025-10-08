"use client";

import { Button } from "@/modules/components/ui/button";
import { Card, CardContent } from "@/modules/components/ui/card";
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
        "w-full bg-card border border-border",
        className
      )}
    >
      <CardContent className="p-4">
        <div className="space-y-4">
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
              variant="outline"
              size="lg"
              onClick={onNext}
              disabled={totalCards <= 1}
              className="flex-1 max-w-32"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Secondary Controls */}
          <div className="flex items-center justify-between gap-2">
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

              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                title="Start over"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
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

          {/* Keyboard shortcuts hint */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground border-t border-border/50 pt-3">
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
              <Kbd>R</Kbd>
              Reset
            </KbdGroup>
            <KbdGroup className="flex items-center gap-1.5">
              <Kbd>S</Kbd>
              Shuffle
            </KbdGroup>
            <KbdGroup className="flex items-center gap-1.5">
              <Kbd>Esc</Kbd>
              Exit
            </KbdGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
