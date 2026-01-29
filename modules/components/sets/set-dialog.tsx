"use client";

import { useState, useEffect } from "react";
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
import { ToggleGroup, ToggleGroupItem } from "@/modules/components/ui/toggle-group";
import { toast } from "sonner";
import type { FlashcardSet, CreateSetData } from "@/modules/types/types";

interface SetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  set?: FlashcardSet;
  onSubmit: (data: CreateSetData) => Promise<void>;
  isLoading?: boolean;
}

export function SetDialog({
  open,
  onOpenChange,
  set,
  onSubmit,
  isLoading = false,
}: SetDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    difficulty: 1,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when set prop changes or dialog opens
  useEffect(() => {
    if (open && set) {
      setFormData({
        name: set.name,
        description: set.description || "",
        difficulty: set.difficulty || 1,
      });
    } else if (open && !set) {
      setFormData({
        name: "",
        description: "",
        difficulty: 1,
      });
    }
  }, [open, set]);

  // Reset form when dialog closes (with delay to prevent flickering during animation)
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Delay clearing to prevent flickering during close animation
      setTimeout(() => {
        setFormData({
          name: "",
          description: "",
          difficulty: 1,
        });
        setErrors({});
      }, 200);
    }
    onOpenChange(newOpen);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Set name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Set name must be at least 2 characters";
    } else if (formData.name.trim().length > 50) {
      newErrors.name = "Set name must be at most 50 characters";
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

  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

  const handleDifficultyChange = (value: string) => {
    if (value) {
      setFormData((prev) => ({ ...prev, difficulty: parseInt(value) }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-heading-3">
            {set ? "Edit Set" : "Create New Set"}
          </DialogTitle>
          <DialogDescription>
            {set
              ? "Update your flashcard set"
              : "Create a new flashcard set for your studies"}
          </DialogDescription>
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
              maxLength={50}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formData.name.length}/50 characters
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
              maxLength={1000}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formData.description.length}/1000 characters
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-body-sm font-medium">
                Difficulty
              </Label>
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
              <ToggleGroupItem value="1" className="font-mono w-16 border">
                1
              </ToggleGroupItem>
              <ToggleGroupItem value="2" className="font-mono w-16 border">
                2
              </ToggleGroupItem>
              <ToggleGroupItem value="3" className="font-mono w-16 border">
                3
              </ToggleGroupItem>
              <ToggleGroupItem value="4" className="font-mono w-16 border">
                4
              </ToggleGroupItem>
              <ToggleGroupItem value="5" className="font-mono w-16 border">
                5
              </ToggleGroupItem>
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
              {isLoading ? "Saving..." : set ? "Update Set" : "Create Set"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
