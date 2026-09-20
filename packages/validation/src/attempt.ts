import { z } from 'zod';

export const createAttemptSchema = z.object({
    assessmentId: z.uuid('Invalid assessment ID'),
    studentName: z.string().min(1, 'Student name is required').max(255),
    studentId: z.string().min(1, 'Student ID is required').max(100),
    studentEmail: z.string().email('Invalid email address'),
});

export const saveAnswerSchema = z.object({
    questionId: z.uuid('Invalid question ID'),
    selectedOptionId: z.uuid('Invalid option ID'),
});

export const bulkSaveAnswersSchema = z.object({
    answers: z.array(z.object({
        questionId: z.uuid('Invalid question ID'),
        selectedOptionId: z.uuid('Invalid option ID'),
    })),
});

export const submitAttemptSchema = z.object({});

export type CreateAttemptInput = z.infer<typeof createAttemptSchema>;
export type SaveAnswerInput = z.infer<typeof saveAnswerSchema>;
export type BulkSaveAnswersInput = z.infer<typeof bulkSaveAnswersSchema>;
export type SubmitAttemptInput = z.infer<typeof submitAttemptSchema>;
