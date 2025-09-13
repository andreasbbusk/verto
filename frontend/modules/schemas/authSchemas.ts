import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number')
});

export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.date(),
  lastLogin: z.date().optional(),
  preferences: z.object({
    studyGoal: z.number().min(1).max(1000).default(20),
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    notifications: z.boolean().default(true)
  }),
  stats: z.object({
    totalStudySessions: z.number().default(0),
    currentStreak: z.number().default(0),
    longestStreak: z.number().default(0),
    totalCardsStudied: z.number().default(0)
  })
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type UserData = z.infer<typeof userSchema>;