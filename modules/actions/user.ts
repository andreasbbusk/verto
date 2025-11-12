"use server";

import { authenticateRequest } from "@/modules/server/auth-helpers";
import { profileRepository } from "@/modules/server/database";
import { serialize } from "@/modules/lib/serialization";
import type { Profile, UpdateProfileData } from "@/modules/types";

/**
 * Get the current authenticated user's profile
 */
export async function getMe(): Promise<Profile> {
  const authResult = await authenticateRequest();

  if (!authResult.success) {
    throw new Error(authResult.error);
  }

  return serialize(authResult.user);
}

/**
 * Update the current user's profile
 */
export async function updateProfile(data: UpdateProfileData): Promise<Profile> {
  const authResult = await authenticateRequest();

  if (!authResult.success) {
    throw new Error(authResult.error);
  }

  const updatedProfile = await profileRepository.update(authResult.user.id, data);

  if (!updatedProfile) {
    throw new Error("Failed to update profile");
  }

  return serialize(updatedProfile);
}
