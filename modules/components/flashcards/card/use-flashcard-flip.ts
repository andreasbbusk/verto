"use client";

import { useCallback, useState } from "react";

interface UseFlashcardFlipOptions {
  isFlipped?: boolean;
  onFlip?: (flipped: boolean) => void;
}

export function useFlashcardFlip({
  isFlipped = false,
  onFlip,
}: UseFlashcardFlipOptions) {
  const [internalFlipped, setInternalFlipped] = useState(false);
  const isControlled = typeof onFlip === "function";
  const flipped = isControlled ? isFlipped : internalFlipped;

  const setFlipped = useCallback(
    (next: boolean) => {
      if (isControlled && onFlip) {
        onFlip(next);
        return;
      }

      setInternalFlipped(next);
    },
    [isControlled, onFlip],
  );

  const toggle = useCallback(() => {
    setFlipped(!flipped);
  }, [flipped, setFlipped]);

  return {
    flipped,
    setFlipped,
    toggle,
  };
}
