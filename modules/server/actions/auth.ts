"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { loginSchema, registerSchema } from "@/modules/schemas/auth.schema";
import { createClient } from "@/modules/server/supabase/server";

type AuthField = "email" | "password" | "name";

type AuthResult =
  | { ok: true }
  | { ok: false; message: string; field?: AuthField };

type OAuthResult = { ok: true; url: string } | { ok: false; message: string };

function resolveFieldFromMessage(message: string): AuthField | undefined {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("password")) return "password";
  if (lowerMessage.includes("email")) return "email";
  if (lowerMessage.includes("name")) return "name";

  return undefined;
}

async function resolveOrigin() {
  const headerList = await headers();
  const origin = headerList.get("origin");

  if (origin) return origin;

  const forwardedHost = headerList.get("x-forwarded-host");
  const forwardedProto = headerList.get("x-forwarded-proto") ?? "https";

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  return process.env.NEXT_PUBLIC_SITE_URL ?? "";
}

export async function signUp(
  email: string,
  password: string,
  name: string,
): Promise<AuthResult> {
  const validation = registerSchema.safeParse({ email, password, name });

  if (!validation.success) {
    const issue = validation.error.issues[0];
    const field = issue.path[0] as AuthField | undefined;

    return { ok: false, message: issue.message, field };
  }

  const trimmedName = validation.data.name.trim();
  const normalizedEmail = validation.data.email.trim();
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password: validation.data.password,
    options: {
      data: {
        name: trimmedName,
      },
    },
  });

  if (error) {
    return {
      ok: false,
      message: error.message,
      field: resolveFieldFromMessage(error.message),
    };
  }

  if (data.user && data.session) {
    try {
      const { data: existingProfile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", data.user.id)
        .maybeSingle();

      if (!existingProfile && !profileError) {
        await supabase.from("profiles").insert({
          id: data.user.id,
          email: normalizedEmail.toLowerCase(),
          name: trimmedName,
        });
      }

      await supabase
        .from("profile_stats")
        .upsert({ profile_id: data.user.id }, { onConflict: "profile_id" });
    } catch (profileError) {
      console.error("Error with profile:", profileError);
    }
  }

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function signIn(
  email: string,
  password: string,
): Promise<AuthResult> {
  const validation = loginSchema.safeParse({ email, password });

  if (!validation.success) {
    const issue = validation.error.issues[0];
    const field = issue.path[0] as AuthField | undefined;

    return { ok: false, message: issue.message, field };
  }

  const normalizedEmail = validation.data.email.trim();
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password: validation.data.password,
  });

  if (error) {
    return {
      ok: false,
      message: error.message,
      field: resolveFieldFromMessage(error.message),
    };
  }

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function startGoogleAuth(): Promise<OAuthResult> {
  const origin = await resolveOrigin();

  if (!origin) {
    return { ok: false, message: "Missing request origin" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error || !data.url) {
    return {
      ok: false,
      message: error?.message ?? "Failed to start Google auth",
    };
  }

  return { ok: true, url: data.url };
}

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut({
    scope: "local",
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function getSession() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}

export async function getUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
