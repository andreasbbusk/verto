import { z } from 'zod';

// Sanitization helper to prevent XSS
const sanitizeString = (str: string) =>
  str.trim().replace(/[<>]/g, '');

export const createSetSchema = z.object({
  name: z
    .string()
    .min(1, 'Set name is required')
    .max(100, 'Set name must be less than 100 characters')
    .transform(sanitizeString),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .transform(sanitizeString)
    .optional()
    .default(''),
  difficulty: z
    .number()
    .int()
    .min(1, 'Difficulty must be between 1 and 5')
    .max(5, 'Difficulty must be between 1 and 5')
    .optional()
    .default(3),
  starred: z
    .boolean()
    .optional()
    .default(false),
});

export const updateSetSchema = z.object({
  name: z
    .string()
    .min(1, 'Set name is required')
    .max(100, 'Set name must be less than 100 characters')
    .transform(sanitizeString)
    .optional(),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .transform(sanitizeString)
    .optional(),
  difficulty: z
    .number()
    .int()
    .min(1, 'Difficulty must be between 1 and 5')
    .max(5, 'Difficulty must be between 1 and 5')
    .optional(),
  starred: z
    .boolean()
    .optional(),
});

export type CreateSetInput = z.infer<typeof createSetSchema>;
export type UpdateSetInput = z.infer<typeof updateSetSchema>;
