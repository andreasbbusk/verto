import { NextRequest } from "next/server";
import { flashcardRepository, initializeData } from "@/modules/server/database";
import { authenticateRequest } from "@/modules/server/auth";
import { updateFlashcardSchema } from "@/modules/schemas/flashcardSchemas";
import {
  apiSuccess,
  apiError,
  validateBody,
  handleServerError,
  parseNumericId,
} from "@/modules/lib/api-utils";

interface RouteParams {
  params: Promise<{ id: string; cardId: string }>;
}

// PUT /api/sets/:id/flashcards/:cardId - Update flashcard
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await authenticateRequest(request);
    if (!authResult.success) {
      return apiError(authResult.error, 401);
    }

    const resolvedParams = await params;
    const setId = parseNumericId(resolvedParams.id);
    const cardId = parseNumericId(resolvedParams.cardId);

    if (setId === null || cardId === null) {
      return apiError("Invalid ID", 400);
    }

    const body = await request.json();
    const validation = await validateBody(updateFlashcardSchema, body);

    if (!validation.success) {
      return validation.response;
    }

    await initializeData();

    // Check if flashcard exists and user owns it
    const existingCard = await flashcardRepository.getById(cardId);
    if (!existingCard || existingCard.userId !== authResult.user.id || existingCard.setId !== setId) {
      return apiError("Flashcard not found", 404);
    }

    try {
      const updatedCard = await flashcardRepository.update(cardId, validation.data);
      return apiSuccess(updatedCard, "Flashcard updated successfully");
    } catch (error) {
      if (error instanceof Error && error.message === "Flashcard not found") {
        return apiError("Flashcard not found", 404);
      }
      throw error;
    }
  } catch (error) {
    return handleServerError(error, "PUT /api/sets/:id/flashcards/:cardId");
  }
}

// DELETE /api/sets/:id/flashcards/:cardId - Delete flashcard
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await authenticateRequest(request);
    if (!authResult.success) {
      return apiError(authResult.error, 401);
    }

    const resolvedParams = await params;
    const setId = parseNumericId(resolvedParams.id);
    const cardId = parseNumericId(resolvedParams.cardId);

    if (setId === null || cardId === null) {
      return apiError("Invalid ID", 400);
    }

    await initializeData();

    // Check if flashcard exists and user owns it
    const existingCard = await flashcardRepository.getById(cardId);
    if (!existingCard || existingCard.userId !== authResult.user.id || existingCard.setId !== setId) {
      return apiError("Flashcard not found", 404);
    }

    try {
      const deletedCard = await flashcardRepository.delete(cardId);
      return apiSuccess(deletedCard, "Flashcard deleted successfully");
    } catch (error) {
      if (error instanceof Error && error.message === "Flashcard not found") {
        return apiError("Flashcard not found", 404);
      }
      throw error;
    }
  } catch (error) {
    return handleServerError(error, "DELETE /api/sets/:id/flashcards/:cardId");
  }
}
