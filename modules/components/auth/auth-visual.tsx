"use client";

import { useEffect, useState } from "react";

const flashcards = [
  {
    front: "What is spaced repetition?",
    back: "A learning technique that increases intervals of time between reviews of previously learned material",
  },
  {
    front: "Active Recall",
    back: "The practice of actively stimulating memory during the learning process",
  },
  {
    front: "How do flashcards improve retention?",
    back: "By forcing active engagement with material through self-testing and retrieval practice",
  },
];

export function AuthVisual() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const flipInterval = setInterval(() => {
      setIsFlipped((prev) => !prev);
    }, 3000);

    const cardInterval = setInterval(() => {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % flashcards.length);
      }, 300);
    }, 6000);

    return () => {
      clearInterval(flipInterval);
      clearInterval(cardInterval);
    };
  }, []);

  const currentCard = flashcards[currentIndex];

  return (
    <div className="relative w-full max-w-lg">
      {/* Gradient Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent blur-3xl" />

      {/* Card Stack Background Cards */}
      <div className="relative">
        <div className="absolute inset-0 bg-card border border-border rounded-xl transform translate-x-7 translate-y-7 opacity-20" />
        <div className="absolute inset-0 bg-card border border-border rounded-xl transform translate-x-3.5 translate-y-3.5 opacity-40" />

        {/* Main Animated Card */}
        <div className="perspective-1000 relative z-10">
          <div
            className={`transform-style-preserve-3d transition-transform duration-700 ${
              isFlipped ? "rotate-x-180" : "rotate-x-0"
            }`}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Front of Card */}
            <div className="backface-hidden w-full h-80 bg-card border border-primary/30 rounded-xl p-8 flex flex-col items-center justify-center shadow-2xl">
              <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">
                  {currentIndex + 1}
                </span>
              </div>
              <p className="text-2xl font-mono text-center text-foreground font-light px-4">
                {currentCard.front}
              </p>
              <div className="absolute bottom-8 text-sm text-muted-foreground">
                Tap to reveal
              </div>
            </div>

            {/* Back of Card */}
            <div
              className="backface-hidden absolute inset-0 w-full h-80 bg-card border border-primary/30 rounded-xl p-8 flex flex-col items-center justify-center shadow-2xl rotate-x-180"
              style={{ transform: "rotateX(180deg)" }}
            >
              <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">
                  {currentIndex + 1}
                </span>
              </div>
              <p className="text-lg font-mono text-center text-foreground/90 leading-relaxed px-4">
                {currentCard.back}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
