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
import { Input } from "@/modules/components/ui/input";
import { Label } from "@/modules/components/ui/label";
import { Textarea } from "@/modules/components/ui/textarea";
import { toast } from "sonner";
import type { FlashcardSet, CreateSetData } from "@/modules/types";

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
    name: set?.name || "",
    description: set?.description || "",
    difficulty: set?.difficulty || 3,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when dialog opens/closes or set changes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setFormData({
        name: "",
        description: "",
        difficulty: 3,
      });
      setErrors({});
    } else if (set) {
      setFormData({
        name: set.name,
        description: set.description || "",
        difficulty: set.difficulty || 3,
      });
    }
    onOpenChange(newOpen);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Set navn er påkrævet";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Set navn skal være mindst 2 tegn";
    } else if (formData.name.trim().length > 50) {
      newErrors.name = "Set navn må ikke være længere end 50 tegn";
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
        name: formData.name.trim(),
        description: formData.description.trim(),
        difficulty: formData.difficulty,
      });
      handleOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Kunne ikke gemme set"
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
            {set ? "Rediger Set" : "Opret Nyt Set"}
          </DialogTitle>
          <DialogDescription>
            {set
              ? "Opdater dit flashcard set"
              : "Opret et nyt flashcard set til dine studier"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-body-sm font-medium">
              Set Navn *
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange("name")}
              placeholder="Indtast et beskrivende navn for dit set"
              className={errors.name ? "border-destructive" : ""}
              maxLength={50}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formData.name.length}/50 tegn
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-body-sm font-medium">
              Beskrivelse (valgfri)
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleInputChange("description")}
              placeholder="Tilføj en beskrivelse af hvad dette set indeholder"
              rows={3}
              className={errors.description ? "border-destructive" : ""}
              maxLength={200}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formData.description.length}/200 tegn
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
              Annuller
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Gemmer..." : set ? "Opdater Set" : "Opret Set"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
