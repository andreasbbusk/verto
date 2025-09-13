import { NextRequest, NextResponse } from "next/server";
import { flashcardRepository, initializeData } from "@/modules/server/database";

interface RouteParams {
  params: Promise<{ name: string }>;
}

// GET /api/sets/:name/flashcards - Get flashcards by set name
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const setName = decodeURIComponent(resolvedParams.name);
    await initializeData();

    const setFlashcards = await flashcardRepository.getBySet(setName);

    return NextResponse.json({
      success: true,
      set: setName,
      count: setFlashcards.length,
      data: setFlashcards,
    });
  } catch (error) {
    console.error("Error retrieving set flashcards:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve set flashcards",
      },
      { status: 500 }
    );
  }
}
