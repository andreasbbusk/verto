"use client";

import { useEffect } from "react";

interface UseStudyKeyboardNavigationOptions {
  onPrevious: () => void;
  onNext: () => void;
  onFlip: () => void;
  isDialogOpen: boolean;
}

export function useStudyKeyboardNavigation({
  onPrevious,
  onNext,
  onFlip,
  isDialogOpen,
}: UseStudyKeyboardNavigationOptions) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      if (target.tagName === "TEXTAREA" || target.tagName === "INPUT") {
        return;
      }

      if (isDialogOpen) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onPrevious();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        onNext();
      } else if (
        event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === " "
      ) {
        event.preventDefault();
        onFlip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDialogOpen, onFlip, onNext, onPrevious]);
}
