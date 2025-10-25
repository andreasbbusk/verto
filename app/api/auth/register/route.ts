import { NextRequest, NextResponse } from "next/server";
import { userRepository } from "@/modules/server/database";
import { registerSchema } from "@/modules/schemas/auth.schema";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { email, password, name } = validation.data;
    const hashedPassword = await bcrypt.hash(password, 12);

    await userRepository.create({
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

    return NextResponse.json(
      { message: "Account created successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
