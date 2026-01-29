'use client';

import { cn } from '@/modules/lib/utils';

interface ProgressBarProps {
  current: number;
  total: number;
  onProgressClick?: (index: number) => void;
  className?: string;
  showNumbers?: boolean;
}

export function ProgressBar({ 
  current, 
  total, 
  onProgressClick, 
  className,
  showNumbers = true 
}: ProgressBarProps) {
  const percentage = total > 0 ? ((current + 1) / total) * 100 : 0;
  const maxDots = 10;
  const dotsToRender = total > maxDots ? maxDots : total;
  const dotIndices = Array.from({ length: dotsToRender }, (_, index) => {
    if (dotsToRender === 1) {
      return 0;
    }

    const progress = index / (dotsToRender - 1);
    return Math.round(progress * (total - 1));
  });
  const activeDotPosition = dotIndices.reduce((closestIndex, value, index) => {
    const closestDistance = Math.abs(dotIndices[closestIndex] - current);
    const valueDistance = Math.abs(value - current);
    return valueDistance < closestDistance ? index : closestIndex;
  }, 0);

  return (
    <div className={cn("space-y-3", className)}>
      {/* Progress bar */}
      <div className="relative">
        <div className="w-full bg-muted border rounded-full h-2">
          <div
            className="bg-primary h-2 -translate-[1px] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Progress text */}
        {showNumbers && (
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Card {current + 1}</span>
            <span>{Math.round(percentage)}%</span>
            <span>of {total}</span>
          </div>
        )}
      </div>

      {/* Clickable dots for direct navigation */}
      {total > 1 && onProgressClick && (
        <div className="flex justify-center">
          <div
            className={cn(
              "flex items-center gap-2"
            )}
          >
            {dotIndices.map((index, dotPosition) => (
              <button
                key={index}
                onClick={() => onProgressClick(index)}
                className={cn(
                  "rounded-full transition-all duration-200 hover:scale-110",
                  total > maxDots ? "w-2.5 h-2.5" : "w-3 h-3",
                  dotPosition === activeDotPosition
                    ? "bg-primary scale-110 shadow-sm ring-2 ring-primary/20"
                    : index < current
                    ? "bg-primary/60 hover:bg-primary/80"
                    : "bg-muted border hover:bg-muted-foreground/20"
                )}
                title={`Go to card ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
