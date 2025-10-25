import { z } from 'zod';

// Sanitization helper to prevent XSS
const sanitizeString = (str: string) =>
  str.trim().replace(/[<>]/g, '');

export const createFlashcardSchema = z.object({
  setId: z
    .number()
    .int()
    .positive('Set ID must be a positive number'),
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
});

export type CreateFlashcardInput = z.infer<typeof createFlashcardSchema>;
export type UpdateFlashcardInput = z.infer<typeof updateFlashcardSchema>;
