import { NextRequest } from "next/server";
import { setRepository, initializeData } from "@/modules/server/database";
import { authenticateRequest } from "@/modules/server/auth-helpers";
import { createSetSchema } from "@/modules/schemas/setSchemas";
import { apiSuccess, apiError, validateBody, handleServerError } from "@/modules/lib/api-utils";

// GET /api/sets - Get user's sets
export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateRequest();
    if (!authResult.success) {
      return apiError(authResult.error, 401);
    }

    await initializeData();
    const sets = await setRepository.getByUserId(authResult.user.id);

    return apiSuccess(sets);
  } catch (error) {
    return handleServerError(error, "GET /api/sets");
  }
}

// POST /api/sets - Create new set
export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateRequest();
    if (!authResult.success) {
      return apiError(authResult.error, 401);
    }

    const body = await request.json();
    const validation = await validateBody(createSetSchema, body);

    if (!validation.success) {
      return validation.response;
    }

    await initializeData();

    try {
      const newSet = await setRepository.create({
        ...validation.data,
        userId: authResult.user.id,
      });

      return apiSuccess(newSet, "Set created successfully", 201);
    } catch (error) {
      if (error instanceof Error && error.message === "Set already exists") {
        return apiError("Set already exists", 409);
      }
      throw error;
    }
  } catch (error) {
    return handleServerError(error, "POST /api/sets");
  }
}
