"use server";

import { createClient } from "@/modules/lib/supabase/server";
import { profileRepository } from "@/modules/server/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signUp(email: string, password: string, name: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // If user is created and authenticated, ensure profile exists
  if (data.user && data.session) {
    try {
      // Check if profile exists (might be created by trigger)
      const existingProfile = await profileRepository.getById(data.user.id);
      
      // If not, create it manually (fallback)
      if (!existingProfile) {
        await profileRepository.create(data.user.id, {
          email: data.user.email!,
          name,
        });
      }
    } catch (profileError) {
      console.error("Error with profile:", profileError);
      // Don't fail the signup if profile creation fails - trigger might handle it
    }
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
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
