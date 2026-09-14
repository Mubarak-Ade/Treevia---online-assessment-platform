import { z } from 'zod';

// ─── Health ───────────────────────────────────────────────────────────────────

export const healthResponseSchema = z.object({
    status: z.literal('ok'),
    database: z.enum(['connected', 'unavailable']),
    timestamp: z.string().datetime(),
});

export type HealthResponseInput = z.infer<typeof healthResponseSchema>;

export {registerSchema, loginSchema, refreshTokenSchema} from './auth.js';
export type {RegisterInput, LoginInput} from './auth.js';

export {assessmentSchema} from './assessment.js';
export type {AssessmentInput} from "./assessment.js"

export { questionSchema, questionUpdateSchema, questionReorderSchema, questionOptionSchema } from './question.js';
export type { QuestionInput, QuestionUpdateInput, QuestionReorderInput, QuestionOptionInput } from './question.js';
export { questionTypeEnum } from './question.js';
export type { QuestionTypeInput } from './question.js';
