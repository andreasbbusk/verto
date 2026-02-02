"use client";

import type { FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/modules/components/ui/dialog";
import { Button } from "@/modules/components/ui/button";
import { Input } from "@/modules/components/ui/input";
import { Label } from "@/modules/components/ui/label";
import { Textarea } from "@/modules/components/ui/textarea";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/modules/components/ui/toggle-group";
import { toast } from "sonner";
import type { CreateSetData, FlashcardSet } from "@/modules/types/types";
import { SET_DESCRIPTION_MAX, SET_NAME_MAX } from "./set-dialog-constants";
import { useSetFormState } from "./use-set-form-state";

interface SetDialogEditProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  set: FlashcardSet;
  onSubmit: (data: CreateSetData) => Promise<void>;
  isLoading?: boolean;
}

export function SetDialogEdit({
  open,
  onOpenChange,
  set,
  onSubmit,
  isLoading = false,
}: SetDialogEditProps) {
  const {
    formData,
    errors,
    resetForm,
    validateForm,
    handleInputChange,
    handleDifficultyChange,
    setFormDataFromSet,
  } = useSetFormState({ set });

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setFormDataFromSet(set);
    } else {
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

    try {
      await onSubmit({
        name: formData.name.trim(),
        description: formData.description.trim(),
        difficulty: formData.difficulty,
      });
      handleOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save set"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-heading-3">Edit Set</DialogTitle>
          <DialogDescription>Update your flashcard set</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-body-sm font-medium">
              Set Name *
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange("name")}
              placeholder="Enter a descriptive name for your set"
              className={errors.name ? "border-destructive" : ""}
              maxLength={SET_NAME_MAX}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formData.name.length}/{SET_NAME_MAX} characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-body-sm font-medium">
              Description (optional)
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleInputChange("description")}
              placeholder="Add a description of what this set contains"
              rows={4}
              className={errors.description ? "border-destructive" : ""}
              maxLength={SET_DESCRIPTION_MAX}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formData.description.length}/{SET_DESCRIPTION_MAX} characters
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-body-sm font-medium">Difficulty</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Choose a difficulty from 1 to 5
              </p>
            </div>
            <ToggleGroup
              type="single"
              value={formData.difficulty.toString()}
              onValueChange={handleDifficultyChange}
              className="justify-start gap-2"
            >
              {Array.from({ length: 5 }).map((_, index) => {
                const value = (index + 1).toString();
                return (
                  <ToggleGroupItem
                    key={value}
                    value={value}
                    className="font-mono w-16 border"
                  >
                    {value}
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
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
              {isLoading ? "Saving..." : "Update Set"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export type { SetDialogEditProps };
