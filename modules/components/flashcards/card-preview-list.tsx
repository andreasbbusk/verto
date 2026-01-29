"use client";

import { Button } from "@/modules/components/ui/button";
import { Card, CardContent } from "@/modules/components/ui/card";
import { ScrollArea } from "@/modules/components/ui/scroll-area";
import type { ParsedFlashcard } from "@/modules/types/types";
import { AlertCircle, X } from "lucide-react";

interface CardPreviewListProps {
  cards: ParsedFlashcard[];
  onRemove?: (index: number) => void;
}

export function CardPreviewList({ cards, onRemove }: CardPreviewListProps) {

  if (cards.length === 0) {
    return (
      <p className="text-center p-8 text-sm text-muted-foreground">
        No cards to show
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <ScrollArea className="h-[400px] pr-3">
        <div className="space-y-3 mt-5">
          {cards.map((card, index) => (
            <Card
              key={index}
              className={card.error ? "border-destructive" : ""}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-mono text-muted-foreground flex-shrink-0">
                        #{index + 1}
                      </span>
                      <div className="flex-1 min-w-0 -translate-y-0.5">
                        <p className="text-sm font-medium break-words line-clamp-2">
                          {card.front}
                        </p>
                        <p className="text-xs text-muted-foreground break-words line-clamp-2">
                          {card.back}
                        </p>
                      </div>
                    </div>
                    {card.error && (
                      <div className="flex items-start gap-2 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                        <span>{card.error}</span>
                      </div>
                    )}
                  </div>
                  {onRemove && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemove(index)}
                      className="h-6 w-6 p-0 flex-shrink-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
