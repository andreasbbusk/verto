import { NextRequest, NextResponse } from "next/server";
import { userRepository } from "@/modules/server/database";
import {
  verifyToken,
  generateToken,
  sanitizeUser,
} from "@/modules/server/auth";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    // Verify the current token
    const tokenPayload = verifyToken(token);
    if (!tokenPayload) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await userRepository.getById(tokenPayload.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate new token
    const newToken = generateToken(user.id);
    const sanitizedUser = sanitizeUser(user);

    return NextResponse.json(
      {
        user: sanitizedUser,
        token: newToken,
        message: "Token refreshed successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Token refresh error:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
