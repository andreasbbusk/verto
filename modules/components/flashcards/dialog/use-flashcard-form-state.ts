"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import type { Flashcard as FlashcardData } from "@/modules/types/types";

interface FlashcardFormData {
  front: string;
  back: string;
  starred: boolean;
}

interface UseFlashcardFormStateOptions {
  flashcard?: FlashcardData | null;
  open: boolean;
}

export function useFlashcardFormState({
  flashcard,
  open,
}: UseFlashcardFormStateOptions) {
  const [formData, setFormData] = useState<FlashcardFormData>(() => ({
    front: flashcard?.front || "",
    back: flashcard?.back || "",
    starred: flashcard?.starred || false,
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (flashcard && open) {
      setFormData({
        front: flashcard.front,
        back: flashcard.back,
        starred: flashcard.starred || false,
      });
    }
  }, [flashcard, open]);

  const resetForm = () => {
    setFormData({
      front: "",
      back: "",
      starred: false,
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.front.trim()) {
      newErrors.front = "Front is required";
    }

    if (!formData.back.trim()) {
      newErrors.back = "Back is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange =
    (field: keyof FlashcardFormData) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    validateForm,
    handleInputChange,
    resetForm,
  };
}

export type { FlashcardFormData };
