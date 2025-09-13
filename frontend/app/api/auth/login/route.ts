import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { userRepository } from "@/modules/server/database";
import {
  verifyPassword,
  sanitizeUser,
  generateToken,
} from "@/modules/server/auth";
import { loginSchema } from "@/modules/schemas/authSchemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid input data",
          details: validation.error.issues.map((issue) => issue.message),
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Find user by email
    const user = await userRepository.getByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Update last login
    const updatedUser = await userRepository.updateLastLogin(user.id);

    // Generate JWT token
    const token = generateToken(updatedUser.id);

    // Return sanitized user data with token
    const sanitizedUser = sanitizeUser(updatedUser);

    return NextResponse.json(
      {
        user: sanitizedUser,
        token: token,
        message: "Login successful",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
