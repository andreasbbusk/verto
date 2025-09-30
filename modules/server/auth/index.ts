import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { userRepository } from "../database";
import type { User, TokenPayload, SanitizedUser } from "@/modules/types";

// Validate required environment variables
const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 12;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Token utilities
export function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET as string, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET as string);
    return payload as TokenPayload;
  } catch (error) {
    return null;
  }
}

// User utilities
export function sanitizeUser(user: User): SanitizedUser {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
}

// Request authentication
export interface AuthenticatedRequest extends NextRequest {
  user?: User;
}

export async function authenticateRequest(
  request: NextRequest
): Promise<{ success: true; user: User } | { success: false; error: string }> {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return { success: false, error: "Authorization header is required" };
    }

    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return { success: false, error: "Token is required" };
    }

    const tokenPayload = verifyToken(token);

    if (!tokenPayload) {
      return { success: false, error: "Invalid or expired token" };
    }

    const user = await userRepository.getById(tokenPayload.userId);

    if (!user) {
      return { success: false, error: "User not found" };
    }

    return { success: true, user };
  } catch (error) {
    console.error("Authentication error occurred");
    return { success: false, error: "Authentication failed" };
  }
}

// Re-export types
export type { TokenPayload, SanitizedUser };