"use client";

import { FlashcardCard } from "@/modules/components/flashcards/card/flashcard-card";
import { Button } from "@/modules/components/ui/button";
import { marketingCopy } from "@/modules/components/marketing/content";
import type { Flashcard } from "@/modules/types/types";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

export function FlashcardFlipDemo() {
  const { flashcard } = marketingCopy.demos;
  const [activeIndex, setActiveIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [starredIds, setStarredIds] = useState<Set<string>>(() => new Set());

  const activeCard = useMemo(() => {
    const card = flashcard.cards[activeIndex];
    return {
      ...card,
      setId: flashcard.setId,
      userId: flashcard.userId,
      starred: starredIds.has(card.id),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reviewCount: activeIndex + 1,
    } satisfies Flashcard;
  }, [activeIndex, flashcard.cards, flashcard.setId, flashcard.userId, starredIds]);

  const totalCards = flashcard.cards.length;
  const progress = ((activeIndex + 1) / totalCards) * 100;

  const handleAdvance = () => {
    setFlipped(false);
    setActiveIndex((index) => (index + 1) % totalCards);
  };

  const handlePrevious = () => {
    setFlipped(false);
    setActiveIndex((index) => (index - 1 + totalCards) % totalCards);
  };

  const handleToggleStar = (flashcard: Flashcard) => {
    setStarredIds((current) => {
      const next = new Set(current);
      if (next.has(flashcard.id)) {
        next.delete(flashcard.id);
      } else {
        next.add(flashcard.id);
      }
      return next;
    });
  };

  return (
    <div className="marketing-flashcard-soft">
      <div className="relative mx-auto w-full max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCard.id}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <FlashcardCard
              flashcard={activeCard}
              isFlipped={flipped}
              onFlip={setFlipped}
              onToggleStar={handleToggleStar}
              earmarkNumber={activeIndex + 1}
              earmarkLabel={activeCard.tag}
              className="w-full max-w-2xl"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 rounded-2xl border border-foreground/10 bg-card/70 p-5 lg:p-6">
        <div className="flex items-center justify-between text-xs font-mono font-semibold uppercase tracking-[0.2em] text-primary">
          <span>{flashcard.sessionLabel}</span>
          <span>
            {activeIndex + 1}/{totalCards}
          </span>
        </div>
        <div className="mt-4 h-1.5 w-full rounded-full bg-foreground/10">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Button variant="outline" size="sm" onClick={handlePrevious}>
            {flashcard.controls.previous}
          </Button>
          <Button
            variant={flipped ? "secondary" : "default"}
            size="sm"
            onClick={() => setFlipped((value) => !value)}
          >
            {flipped ? flashcard.controls.front : flashcard.controls.flip}
          </Button>
          <Button variant="outline" size="sm" onClick={handleAdvance}>
            {flashcard.controls.next}
          </Button>
        </div>
      </div>

      <p className="mt-4 text-center text-xs font-mono text-muted-foreground">
        {flashcard.hint}
      </p>
    </div>
  );
}
