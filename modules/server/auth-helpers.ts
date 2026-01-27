import { createClient } from "@/modules/server/supabase/server";
import type { Profile } from "@/modules/types/types";

export async function authenticateRequest(): Promise<
  { success: true; user: Profile } | { success: false; error: string }
> {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return { success: false, error: "User profile not found" };
  }

  const mappedProfile: Profile = {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
    lastLogin: profile.last_login,
    studyGoal: profile.study_goal,
    theme: profile.theme,
    notifications: profile.notifications,
    totalStudySessions: profile.total_study_sessions,
    currentStreak: profile.current_streak,
    longestStreak: profile.longest_streak,
    totalCardsStudied: profile.total_cards_studied,
  };

  return { success: true, user: mappedProfile };
}
