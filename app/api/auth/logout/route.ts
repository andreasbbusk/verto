import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // For simple session-based auth, logout is primarily handled client-side
    // by clearing the Zustand store. This endpoint can be used for additional
    // server-side cleanup if needed in the future (like invalidating tokens).

    return NextResponse.json({ message: "Logout successful" }, { status: 200 });
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
