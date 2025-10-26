"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

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
  const [isPaused, setIsPaused] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);

  const cardRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const flipIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const cardIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentCard = flashcards[currentIndex];

  // Handle flip animation with GSAP
  const performFlip = (shouldFlip: boolean) => {
    if (!cardRef.current || !frontRef.current || !backRef.current) return;

    const card = cardRef.current;
    const front = frontRef.current;
    const back = backRef.current;

    // Create flip timeline
    const tl = gsap.timeline();
    
    if (shouldFlip) {
      // Flip front to back
      tl.to(card, {
        rotationY: 180,
        duration: 0.7,
        ease: "power2.inOut",
        transformPerspective: 1500,
      })
        .to(
          front,
          {
            opacity: 0,
            duration: 0.05,
            ease: "none",
          },
          0.3
        ) // Fade out at 90° (mid-point)
        .to(
          back,
          {
            opacity: 1,
            duration: 0.05,
            ease: "none",
          },
          0.4
        ); // Fade in after 90°
    } else {
      // Flip back to front
      tl.to(card, {
        rotationY: 0,
        duration: 0.7,
        ease: "power2.inOut",
        transformPerspective: 1500,
      })
        .to(
          back,
          {
            opacity: 0,
            duration: 0.05,
            ease: "none",
          },
          0.3
        ) // Fade out at 90° (mid-point)
        .to(
          front,
          {
            opacity: 1,
            duration: 0.05,
            ease: "none",
          },
          0.4
        ); // Fade in after 90°
    }
  };

  // Watch for flip state changes and trigger animation
  useEffect(() => {
    performFlip(isFlipped);
  }, [isFlipped]);

  // Listen for page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Auto-flip and card change intervals
  useEffect(() => {
    if (isPaused || !isPageVisible) {
      // Clear intervals when paused or tab is hidden
      if (flipIntervalRef.current) clearInterval(flipIntervalRef.current);
      if (cardIntervalRef.current) clearInterval(cardIntervalRef.current);
      return;
    }

    // Flip the card every 4 seconds
    flipIntervalRef.current = setInterval(() => {
      setIsFlipped((prev) => !prev);
    }, 3000);

    // Change to next card every 8 seconds
    cardIntervalRef.current = setInterval(() => {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % flashcards.length);
      }, 400);
    }, 6000);

    return () => {
      if (flipIntervalRef.current) clearInterval(flipIntervalRef.current);
      if (cardIntervalRef.current) clearInterval(cardIntervalRef.current);
    };
  }, [isPaused, isPageVisible]);

  // Add entrance animation for background cards
  useEffect(() => {
    const backCards = document.querySelectorAll(".bg-stack-card");

    gsap.fromTo(
      backCards,
      {
        opacity: 0,
        y: -20,
        scale: 0.95,
      },
      {
        opacity: 0.2,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
      }
    );
  }, []);

  // Handle pause on hover
  const handleMouseEnter = () => {
    setIsPaused(true);
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  return (
    <div
      className="relative w-full max-w-lg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Card Stack Background Cards */}
      <div className="relative">
        {/* <div className="bg-stack-card absolute inset-0 bg-card border border-border rounded-xl transform translate-x-7 translate-y-7 shadow-3d-sm" />
        <div className="bg-stack-card absolute inset-0 bg-card border border-border rounded-xl transform translate-x-3.5 translate-y-3.5 shadow-3d-sm" /> */}

        {/* Main Animated Card */}
        <div className="perspective-2000 relative z-10">
          <div
            ref={cardRef}
            className="transform-style-preserve-3d relative"
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {/* Front of Card */}
            <div
              ref={frontRef}
              className="backface-hidden w-full h-80 bg-card border border-primary/30 rounded-xl p-8 flex flex-col items-center justify-center shadow-3d-lg transition-shadow duration-300 hover:shadow-3d-lg relative overflow-hidden"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              {/* Subtle grain overlay */}
              <div
                className="absolute inset-0 opacity-[1] pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='cardNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23cardNoise)' opacity='0.5'/%3E%3C/svg%3E")`,
                  mixBlendMode: "overlay",
                }}
              />
              <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">
                  {currentIndex + 1}
                </span>
              </div>
              <p className="text-2xl font-mono text-center text-foreground font-light px-4 relative z-10">
                {currentCard.front}
              </p>
            </div>

            {/* Back of Card */}
            <div
              ref={backRef}
              className="backface-hidden absolute inset-0 w-full h-80 bg-card border border-primary/30 rounded-xl p-8 flex flex-col items-center justify-center shadow-3d-lg overflow-hidden"
              style={{
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                opacity: 0,
              }}
            >
              {/* Subtle grain overlay */}
              <div
                className="absolute inset-0 opacity-[1] pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='cardNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23cardNoise)' opacity='0.5'/%3E%3C/svg%3E")`,
                  mixBlendMode: "overlay",
                }}
              />
              <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">
                  {currentIndex + 1}
                </span>
              </div>
              <p className="text-lg font-mono text-center text-foreground/90 leading-relaxed px-4 relative z-10">
                {currentCard.back}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pause Indicator */}
      {isPaused && (
        <p className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-primary/80 font-mono uppercase text-md tracking-wide transition-all duration-700">
          Paused
        </p>
      )}
    </div>
  );
}
