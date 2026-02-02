"use client";

import { useState } from "react";
import { Button } from "@/modules/components/ui/button";
import type { Flashcard as FlashcardData } from "@/modules/types/types";
import { ArrowUpDown } from "lucide-react";
import { FlashcardCardEditable } from "../card/flashcard-card";
import { FlashcardListLayout } from "./flashcard-list-layout";
import { FlashcardReorderDialog } from "./flashcard-reorder-dialog";
import { useFlashcardListState } from "./use-flashcard-list-state";

interface FlashcardListEditableProps {
  flashcards: FlashcardData[];
  onEdit?: (flashcard: FlashcardData) => void;
  onDelete?: (flashcard: FlashcardData) => void;
  onToggleStar?: (flashcard: FlashcardData) => void;
  onCreate?: () => void;
}

export function FlashcardListEditable({
  flashcards,
  onEdit,
  onDelete,
  onToggleStar,
  onCreate,
}: FlashcardListEditableProps) {
  const state = useFlashcardListState(flashcards);
  const [reorderDialogOpen, setReorderDialogOpen] = useState(false);

  return (
    <>
      <FlashcardListLayout state={state} onCreate={onCreate}>
        <FlashcardListLayout.Toolbar>
          <Button
            variant="default"
            size="lg"
            onClick={() => setReorderDialogOpen(true)}
            className="gap-2"
          >
            <ArrowUpDown className="h-4 w-4" />
            Reorder
          </Button>
        </FlashcardListLayout.Toolbar>
        <FlashcardListLayout.Content>
          {state.filteredCards.map((flashcard) => (
            <div key={flashcard.id} className="relative">
              <FlashcardCardEditable
                flashcard={flashcard}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleStar={onToggleStar}
              />
            </div>
          ))}
        </FlashcardListLayout.Content>
      </FlashcardListLayout>

      {state.setId && (
        <FlashcardReorderDialog
          open={reorderDialogOpen}
          onOpenChange={setReorderDialogOpen}
          flashcards={flashcards}
          setId={state.setId}
        />
      )}
    </>
  );
}

export type { FlashcardListEditableProps };
