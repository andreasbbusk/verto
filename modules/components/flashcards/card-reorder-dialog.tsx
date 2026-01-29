"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/modules/components/ui/dialog";
import { Button } from "@/modules/components/ui/button";
import { ScrollArea } from "@/modules/components/ui/scroll-area";
import type { Flashcard } from "@/modules/types/types";
import { useCallback, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { MiniCardPreview } from "./mini-card-preview";
import { useCardOrderStore } from "@/modules/stores/card-order.store";

interface CardReorderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flashcards: Flashcard[];
  setId: string;
}

export function CardReorderDialog({
  open,
  onOpenChange,
  flashcards,
  setId,
}: CardReorderDialogProps) {
  const { getCardOrder, setCardOrder } = useCardOrderStore();
  const getInitialOrder = useCallback(() => {
    const savedOrder = getCardOrder(setId);
    if (savedOrder && savedOrder.length > 0) {
      const cardMap = new Map(flashcards.map((card) => [card.id, card]));
      const validOrder = savedOrder.filter((id) => cardMap.has(id));
      const orderedCards = validOrder.map((id) => cardMap.get(id)!);
      const newCards = flashcards.filter((card) => !validOrder.includes(card.id));
      return [...orderedCards, ...newCards];
    }

    return flashcards;
  }, [flashcards, setId, getCardOrder]);

  const [orderedCards, setOrderedCards] = useState<Flashcard[]>(() =>
    getInitialOrder(),
  );

  // Setup dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setOrderedCards(getInitialOrder());
    }
    onOpenChange(nextOpen);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setOrderedCards((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const handleSave = () => {
    setCardOrder(
      setId,
      orderedCards.map((card) => card.id),
    );
    onOpenChange(false);
  };

  const handleReset = () => {
    setOrderedCards(flashcards);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Reorder cards</DialogTitle>
          <DialogDescription>
            Drag and drop cards to change their order
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[450px] pr-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={orderedCards.map((card) => card.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2 max-w-md overflow-hidden">
                {orderedCards.map((flashcard, index) => (
                  <MiniCardPreview
                    key={flashcard.id}
                    flashcard={flashcard}
                    index={index}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </ScrollArea>

        <DialogFooter className="flex-row gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1 sm:flex-none"
          >
            Reset
          </Button>
          <div className="flex gap-2 flex-1 justify-end">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
