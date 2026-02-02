"use client";

import { useMemo, useState } from "react";
import { useCardOrderStore } from "@/modules/stores/card-order.store";
import type { Flashcard as FlashcardData } from "@/modules/types/types";

type FilterType = "all" | "starred";

interface FlashcardListState {
  setId?: string;
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filteredCards: FlashcardData[];
  setFilteredCards: (cards: FlashcardData[]) => void;
  filteredByType: FlashcardData[];
  starredCount: number;
  hasNoFlashcards: boolean;
  hasNoFilterMatches: boolean;
  hasNoSearchMatches: boolean;
}

export function useFlashcardListState(
  flashcards: FlashcardData[],
): FlashcardListState {
  const setId = flashcards[0]?.setId;
  const savedOrder = useCardOrderStore((state) =>
    setId ? state.cardOrders[setId] : undefined,
  );
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const orderedFlashcards = useMemo(() => {
    if (!setId) return flashcards;
    if (!savedOrder || savedOrder.length === 0) return flashcards;

    const cardMap = new Map(flashcards.map((card) => [card.id, card]));
    const validOrder = savedOrder.filter((id) => cardMap.has(id));
    const orderedCards = validOrder.map((id) => cardMap.get(id)!);
    const newCards = flashcards.filter((card) => !validOrder.includes(card.id));

    return [...orderedCards, ...newCards];
  }, [flashcards, setId, savedOrder]);

  const { filteredByType, starredCount } = useMemo(() => {
    let starred = 0;
    const filtered: FlashcardData[] = [];

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
    useState<FlashcardData[]>(filteredByType);

  const hasNoFlashcards = flashcards.length === 0;
  const hasNoFilterMatches = !hasNoFlashcards && filteredByType.length === 0;
  const hasNoSearchMatches =
    !hasNoFlashcards && !hasNoFilterMatches && filteredCards.length === 0;

  return {
    setId,
    activeFilter,
    setActiveFilter,
    searchTerm,
    setSearchTerm,
    filteredCards,
    setFilteredCards,
    filteredByType,
    starredCount,
    hasNoFlashcards,
    hasNoFilterMatches,
    hasNoSearchMatches,
  };
}

export type { FlashcardListState };
