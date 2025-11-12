"use server";

import { authenticateRequest } from "@/modules/server/auth-helpers";
import {
  flashcardRepository,
  setRepository,
} from "@/modules/server/database";
import {
  createFlashcardSchema,
  updateFlashcardSchema,
} from "@/modules/schemas/flashcard.schema";
import { revalidatePath } from "next/cache";
import { serialize } from "@/modules/lib/serialization";
import { z } from "zod";
import type {
  Flashcard,
  CreateFlashcardData,
  UpdateFlashcardData,
  BulkCreateResult,
} from "@/modules/types";

// Schema for bulk flashcard creation
const bulkFlashcardSchema = z.object({
  flashcards: z
    .array(
      z.object({
        front: z.string().min(1).max(1000),
        back: z.string().min(1).max(1000),
        starred: z.boolean().optional().default(false),
      })
    )
    .min(1, "At least one flashcard is required"),
});

/**
 * Create a new flashcard in a set
 */
export async function createFlashcard(
  setId: string,
  data: Omit<CreateFlashcardData, "setId">
): Promise<Flashcard> {
  const authResult = await authenticateRequest();
  if (!authResult.success) {
    throw new Error(authResult.error);
  }

  if (!setId) {
    throw new Error("Invalid set ID");
  }

  // Check if set exists and user owns it
  const set = await setRepository.getById(setId);
  if (!set || set.userId !== authResult.user.id) {
    throw new Error("Set not found");
  }

  // Validate with setId included
  const validation = createFlashcardSchema.safeParse({
    ...data,
    setId,
  });

  if (!validation.success) {
    throw new Error(validation.error.issues[0].message);
  }

  const newFlashcard = await flashcardRepository.create({
    ...validation.data,
    userId: authResult.user.id,
  });

  revalidatePath(`/sets/${setId}`);
  revalidatePath("/sets");

  return serialize(newFlashcard);
}

/**
 * Update an existing flashcard
 */
export async function updateFlashcard(
  setId: string,
  cardId: string,
  data: UpdateFlashcardData
): Promise<Flashcard> {
  const authResult = await authenticateRequest();
  if (!authResult.success) {
    throw new Error(authResult.error);
  }

  if (!setId || !cardId) {
    throw new Error("Invalid ID");
  }

  const validation = updateFlashcardSchema.safeParse(data);
  if (!validation.success) {
    throw new Error(validation.error.issues[0].message);
  }

  // Check if flashcard exists and user owns it
  const existingCard = await flashcardRepository.getById(cardId);
  if (
    !existingCard ||
    existingCard.userId !== authResult.user.id ||
    existingCard.setId !== setId
  ) {
    throw new Error("Flashcard not found");
  }

  try {
    const updatedCard = await flashcardRepository.update(
      cardId,
      validation.data
    );

    revalidatePath(`/sets/${setId}`);
    revalidatePath("/sets");

    return serialize(updatedCard);
  } catch (error) {
    if (error instanceof Error && error.message === "Flashcard not found") {
      throw new Error("Flashcard not found");
    }
    throw error;
  }
}

/**
 * Delete a flashcard
 */
export async function deleteFlashcard(
  setId: string,
  cardId: string
): Promise<Flashcard> {
  const authResult = await authenticateRequest();
  if (!authResult.success) {
    throw new Error(authResult.error);
  }

  if (!setId || !cardId) {
    throw new Error("Invalid ID");
  }

  // Check if flashcard exists and user owns it
  const existingCard = await flashcardRepository.getById(cardId);
  if (
    !existingCard ||
    existingCard.userId !== authResult.user.id ||
    existingCard.setId !== setId
  ) {
    throw new Error("Flashcard not found");
  }

  try {
    const deletedCard = await flashcardRepository.delete(cardId);

    revalidatePath(`/sets/${setId}`);
    revalidatePath("/sets");

    return serialize(deletedCard);
  } catch (error) {
    if (error instanceof Error && error.message === "Flashcard not found") {
      throw new Error("Flashcard not found");
    }
    throw error;
  }
}

/**
 * Create multiple flashcards in a set at once
 */
export async function createFlashcardsBulk(
  setId: string,
  flashcards: Omit<CreateFlashcardData, "setId">[]
): Promise<BulkCreateResult> {
  const authResult = await authenticateRequest();
  if (!authResult.success) {
    throw new Error(authResult.error);
  }

  if (!setId) {
    throw new Error("Invalid set ID");
  }

  // Check if set exists and user owns it
  const set = await setRepository.getById(setId);
  if (!set || set.userId !== authResult.user.id) {
    throw new Error("Set not found");
  }

  // Validate the bulk request
  const validation = bulkFlashcardSchema.safeParse({ flashcards });
  if (!validation.success) {
    throw new Error(validation.error.issues[0].message);
  }

  // Create all flashcards and track successes/failures
  const result: BulkCreateResult = {
    created: [],
    failed: [],
    successCount: 0,
    failureCount: 0,
  };

  for (let i = 0; i < flashcards.length; i++) {
    const card = flashcards[i];

    try {
      // Validate each card against the schema
      const cardValidation = createFlashcardSchema.safeParse({
        ...card,
        setId,
      });

      if (!cardValidation.success) {
        result.failed.push({
          index: i,
          card,
          error: cardValidation.error.issues[0].message,
        });
        result.failureCount++;
        continue;
      }

      // Create the flashcard
      const newFlashcard = await flashcardRepository.create({
        ...cardValidation.data,
        userId: authResult.user.id,
      });

      result.created.push(newFlashcard);
      result.successCount++;
    } catch (error) {
      result.failed.push({
        index: i,
        card,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      result.failureCount++;
    }
  }

  revalidatePath(`/sets/${setId}`);
  revalidatePath("/sets");

  return serialize(result);
}
