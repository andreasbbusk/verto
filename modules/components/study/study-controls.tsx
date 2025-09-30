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
    <Card className={cn("w-full bg-white/80 backdrop-blur-sm border-0 shadow-modern", className)}>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Primary Navigation */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={onPrevious}
              disabled={totalCards <= 1}
              className="flex-1 max-w-40 shadow-modern transition-all duration-200 hover:shadow-modern-lg"
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Previous
            </Button>

            <div className="flex flex-col items-center gap-3 min-w-32">
              <Button
                variant={isFlipped ? "secondary" : "default"}
                size="lg"
                onClick={onFlip}
                className="w-full shadow-modern bg-brand-purple hover:bg-brand-purple/90"
              >
                {isFlipped ? "Show Front" : "Flip Card"}
              </Button>
              <Badge 
                variant="outline" 
                className="text-sm px-3 py-1 bg-brand-purple-light text-brand-purple border-brand-purple/20"
              >
                {currentIndex + 1} / {totalCards}
              </Badge>
            </div>

            <Button
              variant="outline"
              size="lg"
              onClick={onNext}
              disabled={totalCards <= 1}
              className="flex-1 max-w-40 shadow-modern transition-all duration-200 hover:shadow-modern-lg"
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
                className="bg-white border-2 border-red-300 text-red-600 hover:bg-red-500 hover:text-white shadow-modern transition-all duration-200 hover:shadow-modern-lg font-medium cursor-pointer"
              >
                <Home className="h-4 w-4 mr-2" />
                Exit
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                title="Start over"
                className="bg-white border-2 border-blue-300 text-blue-600 hover:bg-blue-500 hover:text-white shadow-modern transition-all duration-200 hover:shadow-modern-lg font-medium cursor-pointer"
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
                  className={autoPlayEnabled 
                    ? "bg-brand-yellow hover:bg-brand-yellow/80 text-white shadow-modern transition-all duration-200 hover:shadow-modern-lg font-medium cursor-pointer" 
                    : "bg-white border-2 border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-white shadow-modern transition-all duration-200 hover:shadow-modern-lg font-medium cursor-pointer"
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
                  className="bg-white border-2 border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white shadow-modern transition-all duration-200 hover:shadow-modern-lg font-medium cursor-pointer"
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
                  className="bg-white border-2 border-gray-300 text-gray-600 hover:bg-gray-500 hover:text-white shadow-modern transition-all duration-200 hover:shadow-modern-lg font-medium cursor-pointer"
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
                <kbd className="px-2 py-1 bg-muted rounded-md text-xs font-mono">←</kbd>
                <kbd className="px-2 py-1 bg-muted rounded-md text-xs font-mono">→</kbd>
                <span className="text-xs">Navigate</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded-md text-xs font-mono">↑</kbd>
                <kbd className="px-2 py-1 bg-muted rounded-md text-xs font-mono">↓</kbd>
                <kbd className="px-2 py-1 bg-muted rounded-md text-xs font-mono">Space</kbd>
                <span className="text-xs">Flip</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded-md text-xs font-mono">Esc</kbd>
                <span className="text-xs">Exit</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded-md text-xs font-mono">S</kbd>
                <span className="text-xs">Shuffle</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}