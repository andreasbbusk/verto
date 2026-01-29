import { z } from 'zod';

// Sanitization helper to prevent XSS
const sanitizeString = (str: string) =>
  str.trim().replace(/[<>]/g, '');

export const createFlashcardSchema = z.object({
  setId: z
    .string()
    .uuid('Set ID must be a valid UUID'),
  front: z
    .string()
    .min(1, 'Front content is required')
    .max(1000, 'Front content must be less than 1000 characters')
    .transform(sanitizeString),
  back: z
    .string()
    .min(1, 'Back content is required')
    .max(1000, 'Back content must be less than 1000 characters')
    .transform(sanitizeString),
  starred: z
    .boolean()
    .optional()
    .default(false),
});

export const updateFlashcardSchema = z.object({
  front: z
    .string()
    .min(1, 'Front content is required')
    .max(1000, 'Front content must be less than 1000 characters')
    .transform(sanitizeString)
    .optional(),
  back: z
    .string()
    .min(1, 'Back content is required')
    .max(1000, 'Back content must be less than 1000 characters')
    .transform(sanitizeString)
    .optional(),
  starred: z
    .boolean()
    .optional(),
  reviewCount: z
    .number()
    .int()
    .min(0, 'Review count must be 0 or greater')
    .optional(),
  performance: z
    .object({
      easeFactor: z.number().optional(),
      interval: z.number().optional(),
      repetitions: z.number().int().optional(),
      nextReview: z.string().optional(),
      lastReviewed: z.string().optional(),
      difficulty: z.number().optional(),
      correctStreak: z.number().int().optional(),
      totalReviews: z.number().int().optional(),
    })
    .optional(),
});

export type CreateFlashcardInput = z.infer<typeof createFlashcardSchema>;
export type UpdateFlashcardInput = z.infer<typeof updateFlashcardSchema>;
