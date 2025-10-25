"use server";

import { auth } from "@/modules/lib/auth-config";
import { userRepository } from "@/modules/server/database";
import { serialize } from "@/modules/lib/serialization";
import type { User } from "@/modules/types";

/**
 * Get the current authenticated user's profile
 * Returns user data without password field
 */
export async function getMe(): Promise<Omit<User, "password">> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const user = await userRepository.getById(parseInt(session.user.id));

  if (!user) {
    throw new Error("User not found");
  }

  // Remove password from response
  const { password, ...userWithoutPassword } = user;

  return serialize(userWithoutPassword);
}
