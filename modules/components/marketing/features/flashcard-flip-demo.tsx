"use client";

import { FlashcardCard } from "@/modules/components/flashcards/card/flashcard-card";
import type { Flashcard } from "@/modules/types/types";

const demoFlashcard: Flashcard = {
  id: "demo-flashcard-1",
  setId: "demo-set-1",
  front: "What is spaced repetition?",
  back: "A learning technique that increases intervals between review sessions, improving long-term retention.",
  starred: false,
  userId: "demo-user",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  reviewCount: 0,
};

export function FlashcardFlipDemo() {
  return (
    <div className="marketing-flashcard-soft">
      <FlashcardCard
        flashcard={demoFlashcard}
        earmarkNumber={1}
        earmarkLabel="Focus"
        className="w-full max-w-[520px] lg:max-w-2xl"
      />
      <p className="mt-3 text-center text-xs font-mono text-muted-foreground">
        Click to flip
      </p>
    </div>
  );
}
