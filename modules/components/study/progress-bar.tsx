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
            <span>Kort {current + 1}</span>
            <span>{Math.round(percentage)}%</span>
            <span>af {total}</span>
          </div>
        )}
      </div>

      {/* Clickable dots for direct navigation */}
      {total > 1 && total <= 20 && onProgressClick && (
        <div className="flex justify-center">
          <div className="flex space-x-2 flex-wrap gap-y-2">
            {Array.from({ length: total }, (_, index) => (
              <button
                key={index}
                onClick={() => onProgressClick(index)}
                className={cn(
                  "w-3 h-3 rounded-full  transition-all duration-200 hover:scale-110",
                  index === current
                    ? "bg-primary scale-110 shadow-sm ring-2 ring-primary/20"
                    : index < current
                    ? "bg-primary/60 hover:bg-primary/80"
                    : "bg-muted border hover:bg-muted-foreground/20"
                )}
                title={`Gå til kort ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Simplified dots for larger sets */}
      {total > 20 && onProgressClick && (
        <div className="flex justify-center">
          <div className="flex space-x-1">
            {/* Show first few dots */}
            {[...Array(3)].map((_, i) => (
              <button
                key={i}
                onClick={() => onProgressClick(i)}
                className={cn(
                  "w-2 h-2 border rounded-full transition-all duration-200",
                  i === current
                    ? "bg-primary scale-125"
                    : i < current
                    ? "bg-primary/60"
                    : "bg-muted"
                )}
              />
            ))}

            {/* Show ellipsis if needed */}
            {current > 5 && current < total - 3 && (
              <>
                <span className="text-muted-foreground px-1">...</span>
                {/* Show dots around current */}
                {[-1, 0, 1].map((offset) => {
                  const index = current + offset;
                  if (index >= 3 && index < total - 3) {
                    return (
                      <button
                        key={index}
                        onClick={() => onProgressClick(index)}
                        className={cn(
                          "w-2 h-2 border rounded-full transition-all duration-200",
                          offset === 0
                            ? "bg-primary scale-125"
                            : offset < 0
                            ? "bg-primary/60"
                            : "bg-muted"
                        )}
                      />
                    );
                  }
                  return null;
                })}
                <span className="text-muted-foreground px-1">...</span>
              </>
            )}

            {/* Show last few dots */}
            {[...Array(3)].map((_, i) => {
              const index = total - 3 + i;
              return (
                <button
                  key={index}
                  onClick={() => onProgressClick(index)}
                  className={cn(
                    "w-2 h-2 border rounded-full transition-all duration-200",
                    index === current
                      ? "bg-primary scale-125"
                      : index < current
                      ? "bg-primary/60"
                      : "bg-muted"
                  )}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}