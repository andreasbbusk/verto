"use server";

import { revalidatePath } from "next/cache";
import { mapProfile } from "@/modules/server/mappers/profile";
import { authenticateRequest } from "@/modules/server/auth-helpers";
import { createAdminClient } from "@/modules/server/supabase/admin";
import { createClient } from "@/modules/server/supabase/server";
import type { Profile, UpdateProfileData } from "@/modules/types/types";

export async function getMe(): Promise<Profile> {
  const authResult = await authenticateRequest();

  if (!authResult.success) {
    throw new Error(authResult.error);
  }

  return authResult.user;
}

export async function updateProfile(data: UpdateProfileData): Promise<Profile> {
  const authResult = await authenticateRequest();

  if (!authResult.success) {
    throw new Error(authResult.error);
  }

  const supabase = await createClient();

  const updateData: Record<string, unknown> = {};

  if (data.name !== undefined) updateData.name = data.name.trim();
  if (data.studyGoal !== undefined) updateData.study_goal = data.studyGoal;
  if (data.theme !== undefined) updateData.theme = data.theme;
  if (data.notifications !== undefined)
    updateData.notifications = data.notifications;
  if (data.totalStudySessions !== undefined)
    updateData.total_study_sessions = data.totalStudySessions;
  if (data.currentStreak !== undefined)
    updateData.current_streak = data.currentStreak;
  if (data.longestStreak !== undefined)
    updateData.longest_streak = data.longestStreak;
  if (data.totalCardsStudied !== undefined)
    updateData.total_cards_studied = data.totalCardsStudied;
  if (data.lastLogin !== undefined) updateData.last_login = data.lastLogin;

  const { data: updatedProfile, error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", authResult.user.id)
    .select("*")
    .single();

  if (error || !updatedProfile) {
    throw new Error("Failed to update profile");
  }

  return mapProfile(updatedProfile);
}

export async function deleteProfile(): Promise<{ deletedAuthUser: boolean }> {
  const authResult = await authenticateRequest();

  if (!authResult.success) {
    throw new Error(authResult.error);
  }

  const supabase = await createClient();
  const userId = authResult.user.id;

  const { error: flashcardsError } = await supabase
    .from("flashcards")
    .delete()
    .eq("user_id", userId);

  if (flashcardsError) {
    throw new Error("Failed to delete flashcards");
  }

  const { error: setsError } = await supabase
    .from("sets")
    .delete()
    .eq("user_id", userId);

  if (setsError) {
    throw new Error("Failed to delete sets");
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (profileError) {
    throw new Error("Failed to delete profile");
  }

  let deletedAuthUser = false;
  const adminClient = createAdminClient();

  if (adminClient) {
    const { error: authDeleteError } =
      await adminClient.auth.admin.deleteUser(userId);

    if (authDeleteError) {
      throw new Error("Failed to delete authentication account");
    }

    deletedAuthUser = true;
  }

  await supabase.auth.signOut({ scope: "local" });
  revalidatePath("/", "layout");

  return { deletedAuthUser };
}
