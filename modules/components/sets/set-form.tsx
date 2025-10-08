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
import type { FlashcardSet, CreateSetData } from "@/modules/types";

interface SetFormProps {
  set?: FlashcardSet;
  onSubmit: (data: CreateSetData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function SetForm({
  set,
  onSubmit,
  onCancel,
  isLoading = false,
}: SetFormProps) {
  const [formData, setFormData] = useState({
    name: set?.name || "",
    description: set?.description || "",
    difficulty: set?.difficulty || 3,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{set ? "Rediger Set" : "Opret Nyt Set"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Set Navn *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange("name")}
              placeholder="Indtast et beskrivende navn for dit set"
              className={errors.name ? "border-red-500" : ""}
              maxLength={50}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
            <p className="text-xs text-gray-500">
              {formData.name.length}/50 tegn
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Beskrivelse (valgfri)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleInputChange("description")}
              placeholder="Tilføj en beskrivelse af hvad dette set indeholder"
              rows={3}
              className={errors.description ? "border-red-500" : ""}
              maxLength={200}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
            <p className="text-xs text-gray-500">
              {formData.description.length}/200 tegn
            </p>
          </div>


          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Gemmer..." : set ? "Opdater Set" : "Opret Set"}
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
