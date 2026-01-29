import type { Flashcard, FlashcardSet } from "@/modules/types/types";
import { mapFlashcard } from "@/modules/server/mappers/flashcards";

export function mapSet(row: any): FlashcardSet {
  const flashcards = row.flashcards ? row.flashcards.map(mapFlashcard) : undefined;
  const totalReviews =
    row.total_reviews ??
    row.review_count ??
    (flashcards
      ? flashcards.reduce((sum: number, card: Flashcard) => sum + card.reviewCount, 0)
      : undefined);

  return {
    id: row.id,
    name: row.name,
    description: row.description || "",
    difficulty: row.difficulty,
    starred: row.starred,
    userId: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    cardCount: row.card_count ?? row.flashcards?.length,
    totalReviews,
    flashcards,
  };
}
