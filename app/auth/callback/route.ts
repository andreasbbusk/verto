import { createClient } from "@/modules/lib/supabase/server";
import { profileRepository } from "@/modules/server/database";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    // Ensure profile exists for OAuth users
    if (data.user) {
      try {
        const existingProfile = await profileRepository.getById(data.user.id);
        
        // Create profile if it doesn't exist (OAuth signup)
        if (!existingProfile) {
          await profileRepository.create(data.user.id, {
            email: data.user.email!,
            name: data.user.user_metadata?.name || data.user.email!.split('@')[0],
          });
        }
      } catch (error) {
        console.error("Error ensuring profile exists:", error);
        // Don't fail the auth flow - trigger might handle it
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${origin}/dashboard`);
}
