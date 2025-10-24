import { NextRequest } from "next/server";
import { flashcardRepository, setRepository, initializeData } from "@/modules/server/database";
import { authenticateRequest } from "@/modules/server/auth-helpers";
import { createFlashcardSchema } from "@/modules/schemas/flashcardSchemas";
import {
  apiSuccess,
  apiError,
  validateBody,
  handleServerError,
  parseNumericId,
} from "@/modules/lib/api-utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/sets/:id/flashcards - Create flashcard in set
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await authenticateRequest();
    if (!authResult.success) {
      return apiError(authResult.error, 401);
    }

    const resolvedParams = await params;
    const setId = parseNumericId(resolvedParams.id);

    if (setId === null) {
      return apiError("Invalid set ID", 400);
    }

    await initializeData();

    // Check if set exists and user owns it
    const set = await setRepository.getById(setId);
    if (!set || set.userId !== authResult.user.id) {
      return apiError("Set not found", 404);
    }

    const body = await request.json();

    // Override setId from body with URL parameter
    const validation = await validateBody(createFlashcardSchema, {
      ...body,
      setId,
    });

    if (!validation.success) {
      return validation.response;
    }

    const newFlashcard = await flashcardRepository.create({
      ...validation.data,
      userId: authResult.user.id,
    });

    return apiSuccess(newFlashcard, "Flashcard created successfully", 201);
  } catch (error) {
    return handleServerError(error, "POST /api/sets/:id/flashcards");
  }
}
