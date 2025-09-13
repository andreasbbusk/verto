import { NextRequest, NextResponse } from "next/server";
import { setRepository, initializeData } from "@/modules/server/database";
import { authenticateRequest } from "@/modules/server/auth";

// GET /api/sets - Get all sets
export async function GET(request: NextRequest) {
  try {
    // Authenticate the request
    const authResult = await authenticateRequest(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    await initializeData();
    const sets = await setRepository.getAll();

    return NextResponse.json({
      success: true,
      count: sets.length,
      data: sets,
    });
  } catch (error) {
    console.error("Error retrieving sets:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve sets",
      },
      { status: 500 }
    );
  }
}

// POST /api/sets - Create new set
export async function POST(request: NextRequest) {
  try {
    // Authenticate the request
    const authResult = await authenticateRequest(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: "Set name is required",
        },
        { status: 400 }
      );
    }

    await initializeData();

    try {
      const newSet = await setRepository.create({
        name,
        description: description || "",
      });

      return NextResponse.json(
        {
          success: true,
          message: "Set created successfully",
          data: newSet,
        },
        { status: 201 }
      );
    } catch (error) {
      if (error instanceof Error && error.message === "Set already exists") {
        return NextResponse.json(
          {
            success: false,
            error: "Set already exists",
          },
          { status: 409 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Error creating set:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create set",
      },
      { status: 500 }
    );
  }
}
