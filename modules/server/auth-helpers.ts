import { auth } from "@/auth";
import { userRepository } from "./database";
import type { User } from "@/modules/types";

export async function authenticateRequest(): Promise<
  { success: true; user: User } | { success: false; error: string }
> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const user = await userRepository.getById(parseInt(session.user.id));

  if (!user) {
    return { success: false, error: "User not found" };
  }

  return { success: true, user };
}
