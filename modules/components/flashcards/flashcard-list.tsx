"use client";

import { useState } from "react";
import { Button } from "@/modules/components/ui/button";
import { Card, CardContent } from "@/modules/components/ui/card";
import { Badge } from "@/modules/components/ui/badge";
import { SearchFilter } from "@/modules/components/layout/client-wrapper";
import FlashcardComponent from "./flashcard";
import type { Flashcard } from "@/modules/types";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";

interface FlashcardListProps {
  flashcards: Flashcard[];
  onEdit?: (flashcard: Flashcard) => void;
  onDelete?: (flashcard: Flashcard) => void;
  showActions?: boolean;
}

export function FlashcardList({
  flashcards,
  onEdit,
  onDelete,
  showActions = true,
}: FlashcardListProps) {
  const [filteredCards, setFilteredCards] = useState<Flashcard[]>(flashcards);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const groupedCards = { "Alle kort": filteredCards };

  const handleEdit = (flashcard: Flashcard) => {
    onEdit?.(flashcard);
  };

  const handleDelete = (flashcard: Flashcard) => {
    if (
      confirm(`Er du sikker på du vil slette flashcard "${flashcard.front}"?`)
    ) {
      onDelete?.(flashcard);
    }
  };

  if (flashcards.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <div className="text-gray-400 text-lg">📚</div>
            <div>
              <h3 className="font-semibold text-lg">Ingen flashcards fundet</h3>
              <p className="text-gray-500">
                Start med at oprette dit første flashcard
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <SearchFilter
            items={flashcards}
            onFiltered={setFilteredCards}
            searchKey="front"
            placeholder="Søg i flashcards..."
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Eye className="h-4 w-4 mr-1" />
            Kort
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <EyeOff className="h-4 w-4 mr-1" />
            Liste
          </Button>
        </div>
      </div>

      {/* Content */}
      {Object.entries(groupedCards).map(([setName, cards]) => (
        <div key={setName} className="space-y-4">

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((flashcard) => (
                <div key={flashcard.id} className="relative">
                  <FlashcardComponent
                    flashcard={flashcard}
                    editMode={showActions}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {cards.map((flashcard) => (
                <Card
                  key={flashcard.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          {flashcard.starred && <Badge variant="outline">⭐ Stjernet</Badge>}
                          <span className="text-xs text-gray-500">
                            {new Date(flashcard.createdAt).toLocaleDateString(
                              "da-DK"
                            )}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-gray-900">
                            {flashcard.front}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {flashcard.back}
                          </p>
                        </div>
                        <div className="text-xs text-gray-500">
                          Gennemgået {flashcard.reviewCount} gange
                        </div>
                      </div>

                      {showActions && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(flashcard)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(flashcard)}
                          >
                            <Trash2 className="h-4 w-4" />
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
    </div>
  );
}
