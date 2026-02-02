"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import type { FlashcardSet } from "@/modules/types/types";
import {
  SET_DIFFICULTY_DEFAULT,
  SET_NAME_MAX,
  SET_NAME_MIN,
} from "./set-dialog-constants";

interface SetFormData {
  name: string;
  description: string;
  difficulty: number;
}

interface UseSetFormStateOptions {
  set?: FlashcardSet | null;
}

function getInitialFormData(set?: FlashcardSet | null): SetFormData {
  if (!set) {
    return {
      name: "",
      description: "",
      difficulty: SET_DIFFICULTY_DEFAULT,
    };
  }

  return {
    name: set.name,
    description: set.description || "",
    difficulty: set.difficulty || SET_DIFFICULTY_DEFAULT,
  };
}

export function useSetFormState({ set }: UseSetFormStateOptions) {
  const [formData, setFormData] = useState<SetFormData>(() =>
    getInitialFormData(set),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      difficulty: SET_DIFFICULTY_DEFAULT,
    });
    setErrors({});
  };

  const setFormDataFromSet = (nextSet?: FlashcardSet | null) => {
    setFormData(getInitialFormData(nextSet));
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Set name is required";
    } else if (formData.name.trim().length < SET_NAME_MIN) {
      newErrors.name = `Set name must be at least ${SET_NAME_MIN} characters`;
    } else if (formData.name.trim().length > SET_NAME_MAX) {
      newErrors.name = `Set name must be at most ${SET_NAME_MAX} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange =
    (field: keyof SetFormData) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: event.target.value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

  const handleDifficultyChange = (value: string) => {
    if (value) {
      setFormData((prev) => ({ ...prev, difficulty: parseInt(value, 10) }));
    }
  };

  return {
    formData,
    errors,
    resetForm,
    setFormDataFromSet,
    validateForm,
    handleInputChange,
    handleDifficultyChange,
  };
}

export type { SetFormData };
