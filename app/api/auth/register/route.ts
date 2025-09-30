import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { userRepository } from "@/modules/server/database";
import {
  hashPassword,
  sanitizeUser,
  generateToken,
} from "@/modules/server/auth";
import { registerSchema } from "@/modules/schemas/authSchemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid input data",
          details: validation.error.issues.map((issue) => issue.message),
        },
        { status: 400 }
      );
    }

    const { email, password, name } = validation.data;

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await userRepository.create({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      name: name.trim(),
      createdAt: new Date(),
      lastLogin: new Date(),
      preferences: {
        studyGoal: 20,
        theme: "system",
        notifications: true,
      },
      stats: {
        totalStudySessions: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalCardsStudied: 0,
      },
    });

    // Generate JWT token
    const token = generateToken(newUser.id);

    // Return sanitized user data with token
    const sanitizedUser = sanitizeUser(newUser);

    return NextResponse.json(
      {
        user: sanitizedUser,
        token: token,
        message: "Account created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    // Handle specific errors
    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
