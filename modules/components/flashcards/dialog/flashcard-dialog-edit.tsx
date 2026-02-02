"use client";

import type { FormEvent } from "react";
import { Button } from "@/modules/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/modules/components/ui/dialog";
import { Label } from "@/modules/components/ui/label";
import { Textarea } from "@/modules/components/ui/textarea";
import type { Flashcard, UpdateFlashcardData } from "@/modules/types/types";
import { toast } from "sonner";
import { FLASHCARD_TEXT_LIMIT } from "./flashcard-dialog-constants";
import { useFlashcardFormState } from "./use-flashcard-form-state";

interface FlashcardDialogEditProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flashcard: Flashcard;
  onSubmit?: (data: UpdateFlashcardData) => Promise<void>;
  isLoading?: boolean;
}

export function FlashcardDialogEdit({
  open,
  onOpenChange,
  flashcard,
  onSubmit,
  isLoading = false,
}: FlashcardDialogEditProps) {
  const { formData, errors, validateForm, handleInputChange, resetForm } =
    useFlashcardFormState({ flashcard, open });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setTimeout(() => {
        resetForm();
      }, 200);
    }
    onOpenChange(nextOpen);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors and try again");
      return;
    }

    if (!onSubmit) {
      toast.error("No submit handler provided");
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
        error instanceof Error ? error.message : "Could not save flashcard",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-heading-3">Edit Flashcard</DialogTitle>
          <DialogDescription>Update your flashcard</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="front" className="text-body-sm font-medium">
              Front *
            </Label>
            <Textarea
              id="front"
              value={formData.front}
              onChange={handleInputChange("front")}
              placeholder="Enter a question or prompt for the front"
              rows={3}
              className={errors.front ? "border-destructive" : ""}
              maxLength={FLASHCARD_TEXT_LIMIT}
            />
            {errors.front && (
              <p className="text-xs text-destructive">{errors.front}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formData.front.length}/{FLASHCARD_TEXT_LIMIT} characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="back" className="text-body-sm font-medium">
              Back *
            </Label>
            <Textarea
              id="back"
              value={formData.back}
              onChange={handleInputChange("back")}
              placeholder="Enter the answer or explanation for the back"
              rows={3}
              className={errors.back ? "border-destructive" : ""}
              maxLength={FLASHCARD_TEXT_LIMIT}
            />
            {errors.back && (
              <p className="text-xs text-destructive">{errors.back}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formData.back.length}/{FLASHCARD_TEXT_LIMIT} characters
            </p>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Saving..." : "Update Flashcard"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export type { FlashcardDialogEditProps };
