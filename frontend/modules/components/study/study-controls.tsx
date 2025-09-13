'use client';

import { Button } from '@/modules/components/ui/button';
import { Card, CardContent } from '@/modules/components/ui/card';
import { Badge } from '@/modules/components/ui/badge';
import { cn } from '@/modules/lib/utils';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Home, 
  Shuffle, 
  Settings,
  Play,
  Pause
} from 'lucide-react';

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
  className
}: StudyControlsProps) {
  const isFirstCard = currentIndex === 0;
  const isLastCard = currentIndex === totalCards - 1;

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Primary Navigation */}
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={onPrevious}
              disabled={totalCards <= 1}
              className="flex-1 max-w-32"
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Forrige
            </Button>

            <div className="flex flex-col items-center gap-2 min-w-24">
              <Button
                variant={isFlipped ? "secondary" : "default"}
                size="lg"
                onClick={onFlip}
                className="w-full"
              >
                {isFlipped ? "Se forside" : "Vend kort"}
              </Button>
              <Badge variant="outline" className="text-xs">
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
              Næste
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </div>

          {/* Secondary Controls */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onExit}
                title="Tilbage til dashboard"
              >
                <Home className="h-4 w-4 mr-1" />
                Afslut
              </Button>
              
              {onModeChange && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onModeChange}
                  title="Skift studiemodus"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Skift modus
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                title="Start forfra"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {onToggleAutoPlay && (
                <Button
                  variant={autoPlayEnabled ? "default" : "ghost"}
                  size="sm"
                  onClick={onToggleAutoPlay}
                  title={autoPlayEnabled ? "Stop auto-afspilning" : "Start auto-afspilning"}
                >
                  {autoPlayEnabled ? (
                    <Pause className="h-4 w-4 mr-1" />
                  ) : (
                    <Play className="h-4 w-4 mr-1" />
                  )}
                  Auto
                </Button>
              )}

              {onShuffle && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onShuffle}
                  title="Bland kortene"
                >
                  <Shuffle className="h-4 w-4 mr-1" />
                  Bland
                </Button>
              )}

              {onSettings && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSettings}
                  title="Indstillinger"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Keyboard shortcuts hint */}
          <div className="text-center text-xs text-gray-500 border-t pt-3">
            <p>
              <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">←</kbd>{" "}
              <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">→</kbd> Naviger • {" "}
              <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">↑</kbd>{" "}
              <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">↓</kbd>{" "}
              <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Space</kbd> Vend • {" "}
              <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Esc</kbd> Afslut
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}