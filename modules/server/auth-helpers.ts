import { createClient } from "@/modules/server/supabase/server";
import { mapProfile } from "@/modules/server/mappers/profile";
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
    .select("*, profile_stats(*)")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return { success: false, error: "User profile not found" };
  }

  return { success: true, user: mapProfile(profile) };
}
