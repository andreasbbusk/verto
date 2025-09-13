import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { userRepository } from "../database";
import type { User, TokenPayload, SanitizedUser } from "@/modules/types";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-fallback-secret-key-for-development";
const SALT_ROUNDS = 12;

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
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
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
      console.log("No authorization header found");
      return { success: false, error: "Authorization header is required" };
    }

    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      console.log("No token found in authorization header");
      return { success: false, error: "Token is required" };
    }

    console.log("Token received:", token.substring(0, 20) + "...");
    console.log("JWT_SECRET available:", !!process.env.JWT_SECRET);

    const tokenPayload = verifyToken(token);

    if (!tokenPayload) {
      console.log("Token verification failed");
      return { success: false, error: "Invalid or expired token" };
    }

    console.log("Token verified successfully, userId:", tokenPayload.userId);

    const user = await userRepository.getById(tokenPayload.userId);

    if (!user) {
      console.log("User not found for userId:", tokenPayload.userId);
      return { success: false, error: "User not found" };
    }

    console.log("User authenticated successfully:", user.email);
    return { success: true, user };
  } catch (error) {
    console.error("Authentication error:", error);
    return { success: false, error: "Authentication failed" };
  }
}

// Re-export types
export type { TokenPayload, SanitizedUser };