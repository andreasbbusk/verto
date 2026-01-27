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
import type { FlashcardSet, CreateSetData } from "@/modules/types/types";

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


  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{set ? "Edit Set" : "Create New Set"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Set Name *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange("name")}
               placeholder="Enter a descriptive name for your set"

              className={errors.name ? "border-red-500" : ""}
              maxLength={50}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
            <p className="text-xs text-gray-500">
              {formData.name.length}/50 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleInputChange("description")}
               placeholder="Add a description of what this set contains"

              rows={3}
              className={errors.description ? "border-red-500" : ""}
              maxLength={200}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
            <p className="text-xs text-gray-500">
              {formData.description.length}/200 characters
            </p>
          </div>


          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Saving..." : set ? "Update Set" : "Create Set"}
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
