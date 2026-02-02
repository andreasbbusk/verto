import type { Flashcard, FlashcardSet } from "@/modules/types/types";
import { mapFlashcard } from "@/modules/server/mappers/flashcards";

export function mapSet(row: any): FlashcardSet {
  const hasFlashcardCount =
    Array.isArray(row.flashcards) && typeof row.flashcards[0]?.count === "number";
  const flashcards =
    row.flashcards && !hasFlashcardCount ? row.flashcards.map(mapFlashcard) : undefined;
  const flashcardsCount = hasFlashcardCount ? row.flashcards[0].count : undefined;
  const computedTotalReviews = flashcards
    ? flashcards.reduce((sum: number, card: Flashcard) => sum + card.reviewCount, 0)
    : undefined;
  const statsRow = Array.isArray(row.set_stats) ? row.set_stats[0] : row.set_stats;
  const stats = statsRow
    ? {
        totalReviews: statsRow.total_reviews ?? 0,
        cardsStudied: statsRow.cards_studied ?? 0,
        studySessions: statsRow.study_sessions ?? 0,
        lastStudiedAt: statsRow.last_studied_at ?? null,
      }
    : typeof computedTotalReviews === "number"
      ? {
          totalReviews: computedTotalReviews,
          cardsStudied: computedTotalReviews,
          studySessions: 0,
          lastStudiedAt: null,
        }
      : undefined;

  return {
    id: row.id,
    name: row.name,
    description: row.description || "",
    difficulty: row.difficulty,
    starred: row.starred,
    userId: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    cardCount: row.card_count ?? flashcardsCount ?? row.flashcards?.length,
    stats,
    flashcards,
  };
}
