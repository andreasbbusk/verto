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
} from "@/modules/types/types";

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
    starred: flashcard?.starred || false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors and try again");
      return;
    }

    try {
      await onSubmit({
        front: formData.front.trim(),
        back: formData.back.trim(),
        starred: formData.starred,
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save flashcard"
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
          {flashcard ? "Edit Flashcard" : "Create New Flashcard"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="front">Front</Label>
            <Textarea
              id="front"
              value={formData.front}
              onChange={handleInputChange("front")}
               placeholder="Enter a question or prompt for the front"

              rows={3}
              className={errors.front ? "border-red-500" : ""}
            />
            {errors.front && (
              <p className="text-sm text-red-600">{errors.front}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="back">Back</Label>
            <Textarea
              id="back"
              value={formData.back}
              onChange={handleInputChange("back")}
               placeholder="Enter the answer or explanation for the back"

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
                ? "Saving..."
                : flashcard
                ? "Update Flashcard"
                : "Create Flashcard"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
