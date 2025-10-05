"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/modules/components/ui/dialog";
import { Button } from "@/modules/components/ui/button";
import { Label } from "@/modules/components/ui/label";
import { Textarea } from "@/modules/components/ui/textarea";
import { toast } from "sonner";
import type {
  Flashcard,
  CreateFlashcardData,
  UpdateFlashcardData,
} from "@/modules/types";

interface FlashcardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flashcard?: Flashcard;
  onSubmit: (data: CreateFlashcardData | UpdateFlashcardData) => Promise<void>;
  isLoading?: boolean;
}

export function FlashcardDialog({
  open,
  onOpenChange,
  flashcard,
  onSubmit,
  isLoading = false,
}: FlashcardDialogProps) {
  const [formData, setFormData] = useState({
    front: flashcard?.front || "",
    back: flashcard?.back || "",
    starred: flashcard?.starred || false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when dialog opens/closes or flashcard changes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setFormData({
        front: "",
        back: "",
        starred: false,
      });
      setErrors({});
    } else if (flashcard) {
      setFormData({
        front: flashcard.front,
        back: flashcard.back,
        starred: flashcard.starred || false,
      });
    }
    onOpenChange(newOpen);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.front.trim()) {
      newErrors.front = "Forsiden er påkrævet";
    }

    if (!formData.back.trim()) {
      newErrors.back = "Bagsiden er påkrævet";
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
        starred: formData.starred,
      });
      handleOpenChange(false);
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-heading-3">
            {flashcard ? "Rediger Flashcard" : "Opret Nyt Flashcard"}
          </DialogTitle>
          <DialogDescription>
            {flashcard
              ? "Opdater dit flashcard"
              : "Tilføj et nyt flashcard til dit set"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="front" className="text-body-sm font-medium">
              Forside *
            </Label>
            <Textarea
              id="front"
              value={formData.front}
              onChange={handleInputChange("front")}
              placeholder="Indtast spørgsmål eller udtryk for forsiden"
              rows={3}
              className={errors.front ? "border-destructive" : ""}
            />
            {errors.front && (
              <p className="text-xs text-destructive">{errors.front}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="back" className="text-body-sm font-medium">
              Bagside *
            </Label>
            <Textarea
              id="back"
              value={formData.back}
              onChange={handleInputChange("back")}
              placeholder="Indtast svar eller forklaring for bagsiden"
              rows={3}
              className={errors.back ? "border-destructive" : ""}
            />
            {errors.back && (
              <p className="text-xs text-destructive">{errors.back}</p>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Annuller
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading
                ? "Gemmer..."
                : flashcard
                ? "Opdater Flashcard"
                : "Opret Flashcard"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
