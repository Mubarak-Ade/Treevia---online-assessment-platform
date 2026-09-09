import { z } from 'zod';

// ─── Health ───────────────────────────────────────────────────────────────────

export const healthResponseSchema = z.object({
    status: z.literal('ok'),
    database: z.enum(['connected', 'unavailable']),
    timestamp: z.string().datetime(),
});

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters'),
    email: z
        .string()
        .trim()
        .email('Invalid email address')
        .max(255, 'Email must not exceed 255 characters'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .max(100, 'Password must not exceed 100 characters'),
});

export const loginSchema = z.object({
    email: z.string().trim().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
    refreshToken: z.string().optional(),
});

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type HealthResponseInput = z.infer<typeof healthResponseSchema>;