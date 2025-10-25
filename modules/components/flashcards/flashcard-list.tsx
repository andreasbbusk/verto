"use client";

import { SearchFilter } from "@/modules/components/ui/search-filter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/modules/components/ui/alert-dialog";
import { Button } from "@/modules/components/ui/button";
import { Card, CardContent } from "@/modules/components/ui/card";
import { cn } from "@/modules/lib/utils";
import { useViewStore } from "@/modules/stores/view.store";
import { useCardOrderStore } from "@/modules/stores/card-order.store";
import type { Flashcard } from "@/modules/types";
import { LayoutGrid, LayoutList, ArrowUpDown } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import FlashcardComponent from "./flashcard";
import { CardReorderDialog } from "./card-reorder-dialog";

interface FlashcardListProps {
  flashcards: Flashcard[];
  onEdit?: (flashcard: Flashcard) => void;
  onDelete?: (flashcard: Flashcard) => void;
  onToggleStar?: (flashcard: Flashcard) => void;
  showActions?: boolean;
}

export function FlashcardList({
  flashcards,
  onEdit,
  onDelete,
  onToggleStar,
  showActions = true,
}: FlashcardListProps) {
  const { flashcardsView, setFlashcardsView } = useViewStore();
  const { getCardOrder } = useCardOrderStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<Flashcard | null>(null);
  const [reorderDialogOpen, setReorderDialogOpen] = useState(false);

  // Get setId from first flashcard (all cards should have same setId)
  const setId = flashcards[0]?.setId;

  // Apply saved order to flashcards
  const orderedFlashcards = useMemo(() => {
    if (!setId) return flashcards;

    const savedOrder = getCardOrder(setId);
    if (!savedOrder || savedOrder.length === 0) return flashcards;

    // Create a map for quick lookup
    const cardMap = new Map(flashcards.map(card => [card.id, card]));

    // Filter saved order to only include cards that still exist
    const validOrder = savedOrder.filter(id => cardMap.has(id));

    // Get cards that are in savedOrder, maintaining the order
    const orderedCards = validOrder.map(id => cardMap.get(id)!);

    // Add any new cards that aren't in savedOrder
    const newCards = flashcards.filter(card => !validOrder.includes(card.id));

    return [...orderedCards, ...newCards];
  }, [flashcards, setId, getCardOrder]);

  const [filteredCards, setFilteredCards] = useState<Flashcard[]>(orderedFlashcards);

  // Sync filteredCards with orderedFlashcards when it changes
  useEffect(() => {
    setFilteredCards(orderedFlashcards);
  }, [orderedFlashcards]);

  const groupedCards = { "Alle kort": filteredCards };

  const handleEdit = (flashcard: Flashcard) => {
    onEdit?.(flashcard);
  };

  const handleDelete = (flashcard: Flashcard) => {
    setCardToDelete(flashcard);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (cardToDelete) {
      onDelete?.(cardToDelete);
      setDeleteDialogOpen(false);
      setCardToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <SearchFilter
            items={orderedFlashcards}
            onFiltered={setFilteredCards}
            searchKey="front"
            placeholder="Søg i flashcards..."
          />
        </div>

        <div className="flex items-center gap-2">
          {showActions && (
            <Button
              variant="default"
              size="lg"
              onClick={() => setReorderDialogOpen(true)}
              className="gap-2"
            >
              <ArrowUpDown className="h-4 w-4" />
              Omarranger
            </Button>
          )}

          <div className="flex items-center gap-1 border border-border rounded-lg p-1 bg-card">
            <Button
              variant={flashcardsView === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFlashcardsView("grid")}
              className="px-3 transition-all"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={flashcardsView === "table" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFlashcardsView("table")}
              className="px-3 transition-all"
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {Object.entries(groupedCards).map(([setName, cards]) => (
        <div key={setName} className="space-y-4">
          {flashcardsView === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cards.map((flashcard) => (
                <div key={flashcard.id} className="relative">
                  <FlashcardComponent
                    flashcard={flashcard}
                    editMode={showActions}
                    onEdit={showActions ? onEdit : undefined}
                    onDelete={showActions ? onDelete : undefined}
                    onToggleStar={onToggleStar}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {cards.map((flashcard) => (
                <Card key={flashcard.id} className="border-2 border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        {/* Badges and meta row */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {onToggleStar && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onToggleStar(flashcard)}
                              className="h-6 px-2 -ml-2"
                            >
                              <span
                                className={cn(
                                  "text-sm",
                                  flashcard.starred
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                )}
                              >
                                {flashcard.starred ? "★" : "☆"}
                              </span>
                            </Button>
                          )}
                          <span className="text-xs text-muted-foreground font-mono">
                            {new Date(flashcard.createdAt).toLocaleDateString(
                              "da-DK"
                            )}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wide mb-1">
                              Forside
                            </p>
                            <h4 className="font-semibold text-base text-foreground leading-relaxed">
                              {flashcard.front}
                            </h4>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wide mb-1">
                              Bagside
                            </p>
                            <p className="text-sm text-foreground/75 leading-relaxed">
                              {flashcard.back}
                            </p>
                          </div>
                        </div>
                      </div>

                      {showActions && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(flashcard)}
                            className="h-7 text-xs px-3"
                          >
                            Rediger
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(flashcard)}
                            className="h-7 text-xs px-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            Slet
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Slet flashcard?</AlertDialogTitle>
            <AlertDialogDescription>
              Er du sikker på du vil slette dette flashcard? Denne handling kan
              ikke fortrydes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuller</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Slet
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {filteredCards.length === 0 && flashcards.length > 0 && (
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <p className="text-gray-500">
                Ingen flashcards matcher din søgning
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Card Reorder Dialog */}
      {setId && (
        <CardReorderDialog
          open={reorderDialogOpen}
          onOpenChange={setReorderDialogOpen}
          flashcards={flashcards}
          setId={setId}
        />
      )}
    </div>
  );
}
