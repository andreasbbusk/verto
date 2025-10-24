import { NextRequest } from "next/server";
import { setRepository, initializeData } from "@/modules/server/database";
import { authenticateRequest } from "@/modules/server/auth-helpers";
import { updateSetSchema } from "@/modules/schemas/setSchemas";
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

// GET /api/sets/:id - Get set with flashcards
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await authenticateRequest();
    if (!authResult.success) {
      return apiError(authResult.error, 401);
    }

    const resolvedParams = await params;
    const id = parseNumericId(resolvedParams.id);

    if (id === null) {
      return apiError("Invalid set ID", 400);
    }

    await initializeData();
    const set = await setRepository.getByIdWithFlashcards(id);

    if (!set) {
      return apiError("Set not found", 404);
    }

    // Check ownership
    if (set.userId !== authResult.user.id) {
      return apiError("Set not found", 404);
    }

    return apiSuccess(set);
  } catch (error) {
    return handleServerError(error, "GET /api/sets/:id");
  }
}

// PUT /api/sets/:id - Update set
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await authenticateRequest();
    if (!authResult.success) {
      return apiError(authResult.error, 401);
    }

    const resolvedParams = await params;
    const id = parseNumericId(resolvedParams.id);

    if (id === null) {
      return apiError("Invalid set ID", 400);
    }

    const body = await request.json();
    const validation = await validateBody(updateSetSchema, body);

    if (!validation.success) {
      return validation.response;
    }

    await initializeData();

    // Check if set exists and user owns it
    const existingSet = await setRepository.getById(id);
    if (!existingSet || existingSet.userId !== authResult.user.id) {
      return apiError("Set not found", 404);
    }

    try {
      const updatedSet = await setRepository.update(id, validation.data);
      return apiSuccess(updatedSet, "Set updated successfully");
    } catch (error) {
      if (error instanceof Error && error.message === "Set not found") {
        return apiError("Set not found", 404);
      }
      throw error;
    }
  } catch (error) {
    return handleServerError(error, "PUT /api/sets/:id");
  }
}

// DELETE /api/sets/:id - Delete set and all flashcards
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await authenticateRequest();
    if (!authResult.success) {
      return apiError(authResult.error, 401);
    }

    const resolvedParams = await params;
    const id = parseNumericId(resolvedParams.id);

    if (id === null) {
      return apiError("Invalid set ID", 400);
    }

    await initializeData();

    // Check if set exists and user owns it
    const existingSet = await setRepository.getById(id);
    if (!existingSet || existingSet.userId !== authResult.user.id) {
      return apiError("Set not found", 404);
    }

    try {
      const deletedSet = await setRepository.delete(id);
      return apiSuccess(deletedSet, "Set deleted successfully");
    } catch (error) {
      if (error instanceof Error && error.message === "Set not found") {
        return apiError("Set not found", 404);
      }
      throw error;
    }
  } catch (error) {
    return handleServerError(error, "DELETE /api/sets/:id");
  }
}
