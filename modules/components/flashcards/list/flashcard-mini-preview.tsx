"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Star } from "lucide-react";
import { cn } from "@/modules/lib/utils";
import type { Flashcard as FlashcardData } from "@/modules/types/types";

interface FlashcardMiniPreviewProps {
  flashcard: FlashcardData;
  index: number;
}

export function FlashcardMiniPreview({
  flashcard,
  index,
}: FlashcardMiniPreviewProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: flashcard.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex w-full max-w-full min-w-0 items-center gap-3 overflow-hidden p-3 bg-card border border-border rounded-lg",
        isDragging && "opacity-50 z-50 shadow-lg",
      )}
    >
      <button
        className={cn(
          "cursor-grab active:cursor-grabbing",
          "text-muted-foreground hover:text-foreground transition-colors",
          "touch-none",
        )}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span className="text-sm font-mono text-muted-foreground flex-shrink-0">
          #{index + 1}
        </span>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{flashcard.front}</p>
        </div>

        {flashcard.starred && (
          <Star className="h-4 w-4 text-primary fill-primary flex-shrink-0" />
        )}
      </div>
    </div>
  );
}
