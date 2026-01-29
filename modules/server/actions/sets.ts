"use server";

import { revalidatePath } from "next/cache";
import { mapSet } from "@/modules/server/mappers/sets";
import { createClient } from "@/modules/server/supabase/server";
import { createSetSchema, updateSetSchema } from "@/modules/schemas/set.schema";
import type { CreateSetData, UpdateSetData, FlashcardSet } from "@/modules/types/types";

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

export async function getSets(): Promise<FlashcardSet[]> {
  const { supabase } = await requireUser();

  const { data, error } = await supabase
    .from("sets_with_counts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Failed to fetch sets");
  }

  return (data || []).map(mapSet);
}

export async function getSetById(id: string): Promise<FlashcardSet> {
  if (!id) {
    throw new Error("Invalid set ID");
  }

  const { supabase } = await requireUser();

  const { data, error } = await supabase
    .from("sets")
    .select("*, flashcards(*)")
    .eq("id", id)
    .order("created_at", { referencedTable: "flashcards", ascending: true })
    .single();

  if (error || !data) {
    throw new Error("Set not found");
  }

  return mapSet(data);
}

export async function createSet(data: CreateSetData): Promise<FlashcardSet> {
  const { supabase, userId } = await requireUser();

  const validation = createSetSchema.safeParse(data);
  if (!validation.success) {
    throw new Error(validation.error.issues[0].message);
  }

  const trimmedName = validation.data.name.trim();

  const { data: existing, error: checkError } = await supabase
    .from("sets")
    .select("id")
    .eq("user_id", userId)
    .ilike("name", trimmedName)
    .limit(1)
    .maybeSingle();

  if (checkError) {
    throw new Error("Failed to check existing sets");
  }

  if (existing) {
    throw new Error("Set already exists");
  }

  const { data: newSet, error } = await supabase
    .from("sets")
    .insert({
      user_id: userId,
      name: trimmedName,
      description: validation.data.description?.trim() || "",
      difficulty: validation.data.difficulty ?? 3,
      starred: validation.data.starred ?? false,
    })
    .select("*")
    .single();

  if (error || !newSet) {
    throw new Error("Failed to create set");
  }

  const { data: withCount } = await supabase
    .from("sets_with_counts")
    .select("*")
    .eq("id", newSet.id)
    .single();

  revalidatePath("/sets");

  return mapSet(withCount ?? newSet);
}

export async function updateSet(
  id: string,
  data: UpdateSetData
): Promise<FlashcardSet> {
  if (!id) {
    throw new Error("Invalid set ID");
  }

  const { supabase } = await requireUser();

  const validation = updateSetSchema.safeParse(data);
  if (!validation.success) {
    throw new Error(validation.error.issues[0].message);
  }

  const updateData: Record<string, unknown> = {};

  if (validation.data.name !== undefined) {
    updateData.name = validation.data.name.trim();
  }
  if (validation.data.description !== undefined) {
    updateData.description = validation.data.description.trim();
  }
  if (validation.data.difficulty !== undefined) {
    updateData.difficulty = validation.data.difficulty;
  }
  if (validation.data.starred !== undefined) {
    updateData.starred = validation.data.starred;
  }

  const { data: updatedSet, error } = await supabase
    .from("sets")
    .update(updateData)
    .eq("id", id)
    .select("*")
    .single();

  if (error || !updatedSet) {
    throw new Error("Set not found");
  }

  const { data: withCount } = await supabase
    .from("sets_with_counts")
    .select("*")
    .eq("id", id)
    .single();

  revalidatePath(`/sets/${id}`);

  return mapSet(withCount ?? updatedSet);
}

export async function deleteSet(id: string): Promise<FlashcardSet> {
  if (!id) {
    throw new Error("Invalid set ID");
  }

  const { supabase } = await requireUser();

  const { data: existingSet, error: existingError } = await supabase
    .from("sets_with_counts")
    .select("*")
    .eq("id", id)
    .single();

  if (existingError || !existingSet) {
    throw new Error("Set not found");
  }

  const { error } = await supabase.from("sets").delete().eq("id", id);

  if (error) {
    throw new Error("Failed to delete set");
  }

  revalidatePath("/sets");

  return mapSet(existingSet);
}
