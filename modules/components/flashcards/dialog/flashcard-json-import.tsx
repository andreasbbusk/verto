"use client";

import { Button } from "@/modules/components/ui/button";
import { Label } from "@/modules/components/ui/label";
import { Textarea } from "@/modules/components/ui/textarea";
import { Alert, AlertDescription } from "@/modules/components/ui/alert";
import type { ParsedFlashcard } from "@/modules/types/types";
import { AlertCircle } from "lucide-react";
import { FLASHCARD_TEXT_LIMIT } from "./flashcard-dialog-constants";

interface FlashcardJsonImportInputProps {
  value: string;
  onChange: (value: string) => void;
  parsedCards: ParsedFlashcard[];
  parseError: string | null;
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

    if (!Array.isArray(parsed)) {
      return {
        cards: [],
        error: "JSON must be an array of flashcard objects",
      };
    }

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
      } else if (front.length > FLASHCARD_TEXT_LIMIT) {
        error = `Front side exceeds ${FLASHCARD_TEXT_LIMIT} characters`;
      } else if (back.length > FLASHCARD_TEXT_LIMIT) {
        error = `Back side exceeds ${FLASHCARD_TEXT_LIMIT} characters`;
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
  } catch (error) {
    return {
      cards: [],
      error: `Invalid JSON: ${error instanceof Error ? error.message : "Parse error"}`,
    };
  }
}

export function FlashcardJsonImportInput({
  value,
  onChange,
  parsedCards,
  parseError,
}: FlashcardJsonImportInputProps) {
  const jsonSample = `[
  {
    "front": "What is TypeScript?",
    "back": "A typed superset of JavaScript",
    "starred": false
  },
  {
    "front": "What is React?",
    "back": "A JavaScript library for building UIs"
  }
]`;
  const validCount = parsedCards.filter((card) => !card.error).length;

  const handleCopySample = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(jsonSample);
    } catch (error) {
      // Ignore clipboard errors
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
              JSON example
            </p>
            <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
              {jsonSample}
            </pre>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopySample}
            className="self-start"
          >
            Copy sample
          </Button>
        </div>
      </div>

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
          Format: Array of objects with{" "}
          <code className="px-1 py-0.5 bg-muted rounded">front</code> and{" "}
          <code className="px-1 py-0.5 bg-muted rounded">back</code> fields.{" "}
          <code className="px-1 py-0.5 bg-muted rounded">starred</code> is
          optional.
        </p>
        {parsedCards.length > 0 && !parseError && (
          <p className="text-xs text-muted-foreground">
            Valid cards:{" "}
            <span className="text-foreground font-mono">{validCount}</span>/{" "}
            {parsedCards.length}
          </p>
        )}
      </div>

      {parseError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{parseError}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export type { FlashcardJsonImportInputProps };
export { parseJsonFlashcards };
