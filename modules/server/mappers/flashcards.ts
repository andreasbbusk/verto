import type { Flashcard } from "@/modules/types/types";

export function mapFlashcard(row: any): Flashcard {
  return {
    id: row.id,
    setId: row.set_id,
    userId: row.user_id,
    front: row.front,
    back: row.back,
    starred: row.starred,
    reviewCount: row.review_count ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    performance: row.performance,
  };
}
