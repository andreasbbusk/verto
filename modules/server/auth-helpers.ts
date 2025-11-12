import { createClient } from "@/modules/lib/supabase/server";
import { profileRepository } from "./database";
import type { Profile } from "@/modules/types";

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

  const profile = await profileRepository.getById(user.id);

  if (!profile) {
    return { success: false, error: "User profile not found" };
  }

  return { success: true, user: profile };
}
