import { createClient } from "@/modules/server/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    if (data.user) {
      try {
        const { data: existingProfile, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", data.user.id)
          .maybeSingle();

        if (!existingProfile && !profileError) {
          await supabase.from("profiles").insert({
            id: data.user.id,
            email: data.user.email!,
            name:
              data.user.user_metadata?.name ||
              data.user.email!.split("@")[0],
          });
        }

        await supabase
          .from("profile_stats")
          .upsert({ profile_id: data.user.id }, { onConflict: "profile_id" });
      } catch (error) {
        console.error("Error ensuring profile exists:", error);
      }
    }
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
