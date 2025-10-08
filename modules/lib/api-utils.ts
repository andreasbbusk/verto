import { NextResponse } from 'next/server';
import { ZodError, ZodSchema } from 'zod';

// Standard API response wrapper
export function apiSuccess<T>(data: T, message?: string, status = 200) {
  return NextResponse.json(
    {
      success: true,
      ...(message && { message }),
      data,
    },
    { status }
  );
}

// Standard API error response
export function apiError(error: string, status = 400) {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status }
  );
}

// Validation helper
export async function validateBody<T>(
  schema: ZodSchema<T>,
  body: unknown
): Promise<{ success: true; data: T } | { success: false; response: NextResponse }> {
  try {
    const validated = schema.parse(body);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.issues[0];
      return {
        success: false,
        response: apiError(firstError.message, 400),
      };
    }
    return {
      success: false,
      response: apiError('Invalid request data', 400),
    };
  }
}

// Parse and validate numeric ID from params
export function parseNumericId(id: string): number | null {
  const parsed = parseInt(id, 10);
  return isNaN(parsed) ? null : parsed;
}

// Handle internal server errors consistently
export function handleServerError(error: unknown, context: string) {
  console.error(`Error in ${context}:`, error);
  return apiError('An unexpected error occurred', 500);
}
