"use client";

import { SearchFilter } from "@/modules/components/ui/search-filter";
import { Button } from "@/modules/components/ui/button";
import { Card, CardContent } from "@/modules/components/ui/card";
import { useCardOrderStore } from "@/modules/stores/card-order.store";
import type { Flashcard } from "@/modules/types/types";
import { ArrowUpDown, BookOpen, PlusCircle } from "lucide-react";
import { useMemo, useState } from "react";
import FlashcardComponent from "./flashcard";
import { CardReorderDialog } from "./card-reorder-dialog";

interface FlashcardListProps {
  flashcards: Flashcard[];
  onEdit?: (flashcard: Flashcard) => void;
  onDelete?: (flashcard: Flashcard) => void;
  onToggleStar?: (flashcard: Flashcard) => void;
  onCreate?: () => void;
  showActions?: boolean;
}

type FilterType = "all" | "starred";

export function FlashcardList({
  flashcards,
  onEdit,
  onDelete,
  onToggleStar,
  onCreate,
  showActions = true,
}: FlashcardListProps) {
  // Get setId from first flashcard (all cards should have same setId)
  const setId = flashcards[0]?.setId;
  const savedOrder = useCardOrderStore((state) =>
    setId ? state.cardOrders[setId] : undefined,
  );
  const [reorderDialogOpen, setReorderDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Apply saved order to flashcards
  const orderedFlashcards = useMemo(() => {
    if (!setId) return flashcards;
    if (!savedOrder || savedOrder.length === 0) return flashcards;

    // Create a map for quick lookup
    const cardMap = new Map(flashcards.map((card) => [card.id, card]));

    // Filter saved order to only include cards that still exist
    const validOrder = savedOrder.filter((id) => cardMap.has(id));

    // Get cards that are in savedOrder, maintaining the order
    const orderedCards = validOrder.map((id) => cardMap.get(id)!);

    // Add any new cards that aren't in savedOrder
    const newCards = flashcards.filter((card) => !validOrder.includes(card.id));

    return [...orderedCards, ...newCards];
  }, [flashcards, setId, savedOrder]);

  const { filteredByType, starredCount } = useMemo(() => {
    let starred = 0;
    const filtered: Flashcard[] = [];

    for (const card of orderedFlashcards) {
      if (card.starred) {
        starred += 1;
      }

      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "starred" && card.starred);

      if (matchesFilter) {
        filtered.push(card);
      }
    }

    return { filteredByType: filtered, starredCount: starred };
  }, [activeFilter, orderedFlashcards]);

  const [filteredCards, setFilteredCards] =
    useState<Flashcard[]>(filteredByType);

  const hasNoFlashcards = flashcards.length === 0;
  const hasNoFilterMatches = !hasNoFlashcards && filteredByType.length === 0;
  const hasNoSearchMatches =
    !hasNoFlashcards && !hasNoFilterMatches && filteredCards.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant={activeFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("all")}
        >
          All cards
        </Button>
        <Button
          variant={activeFilter === "starred" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("starred")}
        >
          Starred cards
        </Button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <SearchFilter
            items={filteredByType}
            onFiltered={setFilteredCards}
            searchKey="front"
            placeholder="Search flashcards..."
            value={searchTerm}
            onChange={setSearchTerm}
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
              Reorder
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {hasNoFlashcards ? (
        <Card className="p-12">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 border border-border flex items-center justify-center mx-auto">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-lg text-foreground mb-2">
                No flashcards
              </h3>
              <p className="text-muted-foreground text-sm">
                Add your first flashcard to this set
              </p>
            </div>
            {onCreate && (
              <Button onClick={onCreate} size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Flashcard
              </Button>
            )}
          </div>
        </Card>
      ) : hasNoFilterMatches ? (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border border-border flex items-center justify-center mx-auto">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-lg text-foreground mb-2">
                No cards match the filter
              </h3>
              <p className="text-muted-foreground text-sm">
                Try another filter or add more flashcards
              </p>
            </div>
            <Button
              onClick={() => setActiveFilter("all")}
              variant="outline"
              size="sm"
            >
              Show all cards
            </Button>
          </div>
        </Card>
      ) : hasNoSearchMatches ? (
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <p className="text-muted-foreground">
                No flashcards match your search
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCards.map((flashcard) => (
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
