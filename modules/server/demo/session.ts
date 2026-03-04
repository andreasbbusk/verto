import { cookies } from "next/headers";
import { DEMO_SESSION_COOKIE } from "@/modules/server/demo/constants";

export async function isDemoSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(DEMO_SESSION_COOKIE)?.value === "1";
}
