import { NextRequest, NextResponse } from "next/server";
import { flashcardRepository, initializeData } from "@/modules/server/database";
import { authenticateRequest } from "@/modules/server/auth";

// GET /api/flashcards - Get all flashcards
export async function GET(request: NextRequest) {
  try {
    // Authenticate the request
    const authResult = await authenticateRequest(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    await initializeData();
    const flashcards = await flashcardRepository.getAll();

    return NextResponse.json({
      success: true,
      count: flashcards.length,
      data: flashcards,
    });
  } catch (error) {
    console.error("Error retrieving flashcards:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve flashcards",
      },
      { status: 500 }
    );
  }
}

// POST /api/flashcards - Create new flashcard
export async function POST(request: NextRequest) {
  try {
    // Authenticate the request
    const authResult = await authenticateRequest(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const body = await request.json();
    const { front, back, set } = body;

    if (!front || !back) {
      return NextResponse.json(
        {
          success: false,
          error: "Front and back are required",
        },
        { status: 400 }
      );
    }

    await initializeData();
    const newFlashcard = await flashcardRepository.create({
      front,
      back,
      set: set || "General",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Flashcard successfully created",
        data: newFlashcard,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating flashcard:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create flashcard",
      },
      { status: 500 }
    );
  }
}
