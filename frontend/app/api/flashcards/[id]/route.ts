import { NextRequest, NextResponse } from "next/server";
import { flashcardRepository, initializeData } from "@/modules/server/database";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/flashcards/:id - Get flashcard by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await initializeData();
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid flashcard ID",
        },
        { status: 400 }
      );
    }

    const flashcard = await flashcardRepository.getById(id);

    if (!flashcard) {
      return NextResponse.json(
        {
          success: false,
          error: "Flashcard not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: flashcard,
    });
  } catch (error) {
    console.error("Error retrieving flashcard:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve flashcard",
      },
      { status: 500 }
    );
  }
}

// PUT /api/flashcards/:id - Update flashcard by ID
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid flashcard ID",
        },
        { status: 400 }
      );
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

    try {
      const updatedFlashcard = await flashcardRepository.update(id, {
        front,
        back,
        set: set || "General",
      });

      return NextResponse.json({
        success: true,
        message: "Successfully updated flashcard",
        data: updatedFlashcard,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Flashcard not found") {
        return NextResponse.json(
          {
            success: false,
            error: "Flashcard not found",
          },
          { status: 404 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Error updating flashcard:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update flashcard",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/flashcards/:id - Delete flashcard by ID
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid flashcard ID",
        },
        { status: 400 }
      );
    }

    await initializeData();

    try {
      const deletedFlashcard = await flashcardRepository.delete(id);

      return NextResponse.json({
        success: true,
        message: "Flashcard deleted successfully",
        data: deletedFlashcard,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Flashcard not found") {
        return NextResponse.json(
          {
            success: false,
            error: "Flashcard not found",
          },
          { status: 404 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Error deleting flashcard:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete flashcard",
      },
      { status: 500 }
    );
  }
}
