"use client";

import { useRef, useState } from "react";
import { gsap } from "@/modules/components/marketing/gsap/gsap-config";
import { Card } from "@/modules/components/ui/card";

export function FlashcardFlipDemo() {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleFlip = () => {
    if (!cardRef.current) return;

    gsap.to(cardRef.current, {
      rotateY: isFlipped ? 0 : 180,
      duration: 0.6,
      ease: "power2.inOut",
    });

    setIsFlipped(!isFlipped);
  };

  return (
    <div className="relative w-full aspect-[3/2] perspective-1500">
      <div
        ref={cardRef}
        className="relative w-full h-full transform-style-preserve-3d cursor-pointer"
        onClick={handleFlip}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <Card
          className="absolute inset-0 backface-hidden flex items-center justify-center p-8 bg-card hover:border-primary/50 transition-colors"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="text-center">
            <div className="text-sm font-mono text-muted-foreground mb-3">
              QUESTION
            </div>
            <div className="text-2xl font-mono text-foreground">
              What is spaced repetition?
            </div>
          </div>
        </Card>

        {/* Back */}
        <Card
          className="absolute inset-0 backface-hidden flex items-center justify-center p-8 bg-primary/10 border-primary/50"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="text-center">
            <div className="text-sm font-mono text-primary mb-3">ANSWER</div>
            <div className="text-lg text-foreground leading-relaxed">
              A learning technique that increases intervals of time between
              reviews of previously learned material
            </div>
          </div>
        </Card>
      </div>

      {/* Hint text */}
      <div className="absolute -bottom-8 left-0 right-0 text-center">
        <span className="text-xs text-muted-foreground font-mono">
          Click to flip
        </span>
      </div>
    </div>
  );
}
