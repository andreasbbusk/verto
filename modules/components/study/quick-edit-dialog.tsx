"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/modules/components/ui/dialog";
import { Button } from "@/modules/components/ui/button";
import { Textarea } from "@/modules/components/ui/textarea";
import { Label } from "@/modules/components/ui/label";
import type { Flashcard } from "@/modules/types/types";

interface QuickEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flashcard: Flashcard | null;
  onSave: (flashcard: Flashcard, updates: { front: string; back: string }) => Promise<void>;
}

export function QuickEditDialog({
  open,
  onOpenChange,
  flashcard,
  onSave,
}: QuickEditDialogProps) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (flashcard && open) {
      setFront(flashcard.front);
      setBack(flashcard.back);
    }
  }, [flashcard, open]);

  const handleSave = async () => {
    if (!flashcard || !front.trim() || !back.trim()) return;

    setIsSaving(true);
    try {
      await onSave(flashcard, { front: front.trim(), back: back.trim() });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save flashcard:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Flashcard</DialogTitle>
          <DialogDescription>
            Make changes to your flashcard. Press Save when you are done.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="front">Front</Label>
            <Textarea
              id="front"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Question or term"
              className="min-h-[80px] resize-none"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="back">Back</Label>
            <Textarea
              id="back"
              value={back}
              onChange={(e) => setBack(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Answer or definition"
              className="min-h-[80px] resize-none"
            />
          </div>
        </div>
        <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>

            <Button
              onClick={handleSave}
              disabled={isSaving || !front.trim() || !back.trim()}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
