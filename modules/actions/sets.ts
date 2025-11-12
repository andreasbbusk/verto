"use server";

import { authenticateRequest } from "@/modules/server/auth-helpers";
import { setRepository } from "@/modules/server/database";
import { createSetSchema, updateSetSchema } from "@/modules/schemas/set.schema";
import { revalidatePath } from "next/cache";
import { serialize } from "@/modules/lib/serialization";
import type {
  CreateSetData,
  UpdateSetData,
  FlashcardSet,
} from "@/modules/types";

/**
 * Get all sets for the authenticated user
 */
export async function getSets(): Promise<FlashcardSet[]> {
  const authResult = await authenticateRequest();
  if (!authResult.success) {
    throw new Error(authResult.error);
  }

  const sets = await setRepository.getByUserId(authResult.user.id);

  return serialize(sets);
}

/**
 * Get a single set by ID with all flashcards
 */
export async function getSetById(id: string): Promise<FlashcardSet> {
  const authResult = await authenticateRequest();
  if (!authResult.success) {
    throw new Error(authResult.error);
  }

  if (!id) {
    throw new Error("Invalid set ID");
  }

  const set = await setRepository.getByIdWithFlashcards(id);

  if (!set) {
    throw new Error("Set not found");
  }

  // Check ownership
  if (set.userId !== authResult.user.id) {
    throw new Error("Set not found");
  }

  return serialize(set);
}

/**
 * Create a new flashcard set
 */
export async function createSet(data: CreateSetData): Promise<FlashcardSet> {
  const authResult = await authenticateRequest();
  if (!authResult.success) {
    throw new Error(authResult.error);
  }

  const validation = createSetSchema.safeParse(data);
  if (!validation.success) {
    throw new Error(validation.error.issues[0].message);
  }

  try {
    const newSet = await setRepository.create({
      ...validation.data,
      userId: authResult.user.id,
    });

    revalidatePath("/sets");

    return serialize(newSet);
  } catch (error) {
    if (error instanceof Error && error.message === "Set already exists") {
      throw new Error("Set already exists");
    }
    throw error;
  }
}

/**
 * Update an existing flashcard set
 */
export async function updateSet(
  id: string,
  data: UpdateSetData
): Promise<FlashcardSet> {
  const authResult = await authenticateRequest();
  if (!authResult.success) {
    throw new Error(authResult.error);
  }

  if (!id) {
    throw new Error("Invalid set ID");
  }

  const validation = updateSetSchema.safeParse(data);
  if (!validation.success) {
    throw new Error(validation.error.issues[0].message);
  }

  // Check if set exists and user owns it
  const existingSet = await setRepository.getById(id);
  if (!existingSet || existingSet.userId !== authResult.user.id) {
    throw new Error("Set not found");
  }

  try {
    const updatedSet = await setRepository.update(id, validation.data);

    revalidatePath(`/sets/${id}`);

    return serialize(updatedSet);
  } catch (error) {
    if (error instanceof Error && error.message === "Set not found") {
      throw new Error("Set not found");
    }
    throw error;
  }
}

/**
 * Delete a flashcard set and all its flashcards
 */
export async function deleteSet(id: string): Promise<FlashcardSet> {
  const authResult = await authenticateRequest();
  if (!authResult.success) {
    throw new Error(authResult.error);
  }

  if (!id) {
    throw new Error("Invalid set ID");
  }

  // Check if set exists and user owns it
  const existingSet = await setRepository.getById(id);
  if (!existingSet || existingSet.userId !== authResult.user.id) {
    throw new Error("Set not found");
  }

  try {
    const deletedSet = await setRepository.delete(id);

    revalidatePath("/sets");

    return serialize(deletedSet);
  } catch (error) {
    if (error instanceof Error && error.message === "Set not found") {
      throw new Error("Set not found");
    }
    throw error;
  }
}
