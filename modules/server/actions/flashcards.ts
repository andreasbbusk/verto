"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/modules/server/supabase/server";
import { mapFlashcard } from "@/modules/server/mappers/flashcards";
import {
  createFlashcardSchema,
  updateFlashcardSchema,
} from "@/modules/schemas/flashcard.schema";
import type {
  Flashcard,
  CreateFlashcardData,
  UpdateFlashcardData,
  BulkCreateResult,
} from "@/modules/types/types";

const bulkFlashcardSchema = z.object({
  flashcards: z
    .array(
      z.object({
        front: z.string().min(1).max(1000),
        back: z.string().min(1).max(1000),
        starred: z.boolean().optional().default(false),
      }),
    )
    .min(1, "At least one flashcard is required"),
});

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  return { supabase, userId: user.id };
}

export async function getFlashcardsBySet(setId: string): Promise<Flashcard[]> {
  if (!setId) {
    throw new Error("Invalid set ID");
  }

  const { supabase } = await requireUser();

  const { data, error } = await supabase
    .from("flashcards")
    .select("*")
    .eq("set_id", setId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error("Failed to fetch flashcards");
  }

  return (data || []).map(mapFlashcard);
}

export async function createFlashcard(
  setId: string,
  data: Omit<CreateFlashcardData, "setId">,
): Promise<Flashcard> {
  const { supabase, userId } = await requireUser();

  if (!setId) {
    throw new Error("Invalid set ID");
  }

  const validation = createFlashcardSchema.safeParse({
    ...data,
    setId,
  });

  if (!validation.success) {
    throw new Error(validation.error.issues[0].message);
  }

  const { data: setCheck, error: setError } = await supabase
    .from("sets")
    .select("id")
    .eq("id", setId)
    .single();

  if (setError || !setCheck) {
    throw new Error("Set not found");
  }

  const { data: newFlashcard, error } = await supabase
    .from("flashcards")
    .insert({
      set_id: setId,
      user_id: userId,
      front: validation.data.front.trim(),
      back: validation.data.back.trim(),
      starred: validation.data.starred ?? false,
      review_count: 0,
    })
    .select("*")
    .single();

  if (error || !newFlashcard) {
    throw new Error("Failed to create flashcard");
  }

  revalidatePath(`/sets/${setId}`);
  revalidatePath("/sets");

  return mapFlashcard(newFlashcard);
}

export async function updateFlashcard(
  setId: string,
  cardId: string,
  data: UpdateFlashcardData,
): Promise<Flashcard> {
  const { supabase } = await requireUser();

  if (!setId || !cardId) {
    throw new Error("Invalid ID");
  }

  const validation = updateFlashcardSchema.safeParse(data);
  if (!validation.success) {
    throw new Error(validation.error.issues[0].message);
  }

  const updateData: Record<string, unknown> = {};

  if (validation.data.front !== undefined) {
    updateData.front = validation.data.front.trim();
  }
  if (validation.data.back !== undefined) {
    updateData.back = validation.data.back.trim();
  }
  if (validation.data.starred !== undefined) {
    updateData.starred = validation.data.starred;
  }
  if (validation.data.reviewCount !== undefined) {
    updateData.review_count = validation.data.reviewCount;
  }
  if (validation.data.performance !== undefined) {
    updateData.performance = validation.data.performance;
  }

  const { data: updatedCard, error } = await supabase
    .from("flashcards")
    .update(updateData)
    .eq("id", cardId)
    .eq("set_id", setId)
    .select("*")
    .single();

  if (error || !updatedCard) {
    throw new Error("Flashcard not found");
  }

  revalidatePath(`/sets/${setId}`);
  revalidatePath("/sets");

  return mapFlashcard(updatedCard);
}

export async function deleteFlashcard(
  setId: string,
  cardId: string,
): Promise<Flashcard> {
  const { supabase } = await requireUser();

  if (!setId || !cardId) {
    throw new Error("Invalid ID");
  }

  const { data: existingCard, error: existingError } = await supabase
    .from("flashcards")
    .select("*")
    .eq("id", cardId)
    .eq("set_id", setId)
    .single();

  if (existingError || !existingCard) {
    throw new Error("Flashcard not found");
  }

  const { error } = await supabase
    .from("flashcards")
    .delete()
    .eq("id", cardId)
    .eq("set_id", setId);

  if (error) {
    throw new Error("Failed to delete flashcard");
  }

  revalidatePath(`/sets/${setId}`);
  revalidatePath("/sets");

  return mapFlashcard(existingCard);
}

export async function createFlashcardsBulk(
  setId: string,
  flashcards: Omit<CreateFlashcardData, "setId">[],
): Promise<BulkCreateResult> {
  const { supabase, userId } = await requireUser();

  if (!setId) {
    throw new Error("Invalid set ID");
  }

  const setExists = await supabase
    .from("sets")
    .select("id")
    .eq("id", setId)
    .maybeSingle();

  if (setExists.error || !setExists.data) {
    throw new Error("Set not found");
  }

  const validation = bulkFlashcardSchema.safeParse({ flashcards });
  if (!validation.success) {
    throw new Error(validation.error.issues[0].message);
  }

  const result: BulkCreateResult = {
    created: [],
    failed: [],
    successCount: 0,
    failureCount: 0,
  };

  for (let i = 0; i < flashcards.length; i++) {
    const card = flashcards[i];

    try {
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

      const { data: newFlashcard, error } = await supabase
        .from("flashcards")
        .insert({
          set_id: setId,
          user_id: userId,
          front: cardValidation.data.front.trim(),
          back: cardValidation.data.back.trim(),
          starred: cardValidation.data.starred ?? false,
          review_count: 0,
        })
        .select("*")
        .single();

      if (error || !newFlashcard) {
        throw new Error("Failed to create flashcard");
      }

      result.created.push(mapFlashcard(newFlashcard));
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

  return result;
}
