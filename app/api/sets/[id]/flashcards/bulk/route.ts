import { NextRequest } from "next/server";
import { flashcardRepository, setRepository, initializeData } from "@/modules/server/database";
import { authenticateRequest } from "@/modules/server/auth";
import { createFlashcardSchema } from "@/modules/schemas/flashcardSchemas";
import {
  apiSuccess,
  apiError,
  handleServerError,
  parseNumericId,
} from "@/modules/lib/api-utils";
import { z } from "zod";
import type { BulkCreateResult } from "@/modules/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Schema for bulk flashcard creation
const bulkFlashcardSchema = z.object({
  flashcards: z.array(
    z.object({
      front: z.string().min(1).max(1000),
      back: z.string().min(1).max(1000),
      starred: z.boolean().optional().default(false),
    })
  ).min(1, "At least one flashcard is required"),
});

// POST /api/sets/:id/flashcards/bulk - Create multiple flashcards in a set
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const authResult = await authenticateRequest(request);
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

    // Validate the bulk request body
    const validation = bulkFlashcardSchema.safeParse(body);
    if (!validation.success) {
      return apiError(validation.error.issues[0].message, 400);
    }

    const { flashcards } = validation.data;

    // Create all flashcards and track successes/failures
    const result: BulkCreateResult = {
      created: [],
      failed: [],
      successCount: 0,
      failureCount: 0,
    };

    for (let i = 0; i < flashcards.length; i++) {
      const card = flashcards[i];

      try {
        // Validate each card against the schema
        const cardValidation = createFlashcardSchema.safeParse({
          ...card,
          setId,
        });

        if (!cardValidation.success) {
          result.failed.push({
            index: i,
            card,
            error: cardValidation.error.issues[0].message,
          });
          result.failureCount++;
          continue;
        }

        // Create the flashcard
        const newFlashcard = await flashcardRepository.create({
          ...cardValidation.data,
          userId: authResult.user.id,
        });

        result.created.push(newFlashcard);
        result.successCount++;
      } catch (error) {
        result.failed.push({
          index: i,
          card,
          error: error instanceof Error ? error.message : "Unknown error",
        });
        result.failureCount++;
      }
    }

    // Return success even if some cards failed
    // The client can handle partial failures
    return apiSuccess(
      result,
      `Created ${result.successCount} flashcard(s)${
        result.failureCount > 0 ? `, ${result.failureCount} failed` : ""
      }`,
      result.failureCount > 0 ? 207 : 201 // 207 = Multi-Status for partial success
    );
  } catch (error) {
    return handleServerError(error, "POST /api/sets/:id/flashcards/bulk");
  }
}
