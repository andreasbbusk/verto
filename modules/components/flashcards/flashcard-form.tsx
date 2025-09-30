"use client";

import { useState } from "react";
import { Button } from "@/modules/components/ui/button";
import { Input } from "@/modules/components/ui/input";
import { Label } from "@/modules/components/ui/label";
import { Textarea } from "@/modules/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/modules/components/ui/card";
import { toast } from "sonner";
import type {
  Flashcard,
  CreateFlashcardData,
  UpdateFlashcardData,
} from "@/modules/types";

interface FlashcardFormProps {
  flashcard?: Flashcard;
  onSubmit: (data: CreateFlashcardData | UpdateFlashcardData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function FlashcardForm({
  flashcard,
  onSubmit,
  onCancel,
  isLoading = false,
}: FlashcardFormProps) {
  const [formData, setFormData] = useState({
    front: flashcard?.front || "",
    back: flashcard?.back || "",
    set: flashcard?.set || "General",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.front.trim()) {
      newErrors.front = "Forsiden er påkrævet";
    }

    if (!formData.back.trim()) {
      newErrors.back = "Bagsiden er påkrævet";
    }

    if (!formData.set.trim()) {
      newErrors.set = "Set navn er påkrævet";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Ret venligst fejlene og prøv igen");
      return;
    }

    try {
      await onSubmit({
        front: formData.front.trim(),
        back: formData.back.trim(),
        set: formData.set.trim(),
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Kunne ikke gemme flashcard"
      );
    }
  };

  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {flashcard ? "Rediger Flashcard" : "Opret Nyt Flashcard"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="set">Set</Label>
            <Input
              id="set"
              type="text"
              value={formData.set}
              onChange={handleInputChange("set")}
              placeholder="Indtast set navn"
              className={errors.set ? "border-red-500" : ""}
            />
            {errors.set && <p className="text-sm text-red-600">{errors.set}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="front">Forside</Label>
            <Textarea
              id="front"
              value={formData.front}
              onChange={handleInputChange("front")}
              placeholder="Indtast spørgsmål eller udtryk for forsiden"
              rows={3}
              className={errors.front ? "border-red-500" : ""}
            />
            {errors.front && (
              <p className="text-sm text-red-600">{errors.front}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="back">Bagside</Label>
            <Textarea
              id="back"
              value={formData.back}
              onChange={handleInputChange("back")}
              placeholder="Indtast svar eller forklaring for bagsiden"
              rows={3}
              className={errors.back ? "border-red-500" : ""}
            />
            {errors.back && (
              <p className="text-sm text-red-600">{errors.back}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading
                ? "Gemmer..."
                : flashcard
                ? "Opdater Flashcard"
                : "Opret Flashcard"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1"
            >
              Annuller
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
