"use client";

import { Label } from "@/modules/components/ui/label";
import { Textarea } from "@/modules/components/ui/textarea";
import { CardPreviewList } from "./card-preview-list";
import { Alert, AlertDescription } from "@/modules/components/ui/alert";
import type { ParsedFlashcard } from "@/modules/types/types";
import { AlertCircle } from "lucide-react";

interface JsonImportInputProps {
  value: string;
  onChange: (value: string) => void;
  parsedCards: ParsedFlashcard[];
  parseError: string | null;
  onRemoveCard: (index: number) => void;
}

function parseJsonFlashcards(text: string): {
  cards: ParsedFlashcard[];
  error: string | null;
} {
  if (!text.trim()) {
    return { cards: [], error: null };
  }

  try {
    const parsed = JSON.parse(text);

    // Check if it's an array
    if (!Array.isArray(parsed)) {
      return {
        cards: [],
        error: "JSON must be an array of flashcard objects",
      };
    }

    // Validate each card
    const cards: ParsedFlashcard[] = parsed.map((item, index) => {
      if (typeof item !== "object" || item === null) {
        return {
          front: "",
          back: "",
          error: `Item ${index + 1}: Must be an object`,
        };
      }

      const { front, back, starred } = item;
      let error: string | undefined;

      if (typeof front !== "string") {
        error = "Missing or invalid 'front' field";
      } else if (typeof back !== "string") {
        error = "Missing or invalid 'back' field";
      } else if (!front.trim()) {
        error = "Front side cannot be empty";
      } else if (!back.trim()) {
        error = "Back side cannot be empty";
      } else if (front.length > 1000) {
        error = "Front side exceeds 1000 characters";
      } else if (back.length > 1000) {
        error = "Back side exceeds 1000 characters";
      } else if (starred !== undefined && typeof starred !== "boolean") {
        error = "Invalid 'starred' field (must be boolean)";
      }

      return {
        front: String(front || ""),
        back: String(back || ""),
        starred: starred === true,
        error,
      };
    });

    return { cards, error: null };
  } catch (e) {
    return {
      cards: [],
      error: `Invalid JSON: ${e instanceof Error ? e.message : "Parse error"}`,
    };
  }
}

export function JsonImportInput({
  value,
  onChange,
  parsedCards,
  parseError,
  onRemoveCard,
}: JsonImportInputProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="json-input" className="text-body-sm font-medium">
          JSON Data
        </Label>
        <Textarea
          id="json-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Paste JSON array of flashcards:

[
  {
    "front": "What is TypeScript?",
    "back": "A typed superset of JavaScript",
    "starred": false
  },
  {
    "front": "What is React?",
    "back": "A JavaScript library for building UIs"
  }
]`}
          className="font-mono text-xs h-[300px] resize-none overflow-auto whitespace-pre-wrap break-words"
        />
        <p className="text-xs text-muted-foreground">
          Format: Array of objects with <code className="px-1 py-0.5 bg-muted rounded">front</code>{" "}
          and <code className="px-1 py-0.5 bg-muted rounded">back</code> fields.{" "}
          <code className="px-1 py-0.5 bg-muted rounded">starred</code> is optional.
        </p>
      </div>

      {parseError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{parseError}</AlertDescription>
        </Alert>
      )}

      {parsedCards.length > 0 && !parseError && (
        <div className="space-y-2">
          <Label className="text-body-sm font-medium">Preview</Label>
          <CardPreviewList cards={parsedCards} onRemove={onRemoveCard} />
        </div>
      )}
    </div>
  );
}

export { parseJsonFlashcards };
