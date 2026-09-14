import z from "zod";

export const questionTypeEnum = z.enum(['MULTIPLE_CHOICE', 'TRUE_FALSE']);
export type QuestionTypeInput = z.infer<typeof questionTypeEnum>;

export const questionOptionSchema = z.object({
    optionText: z.string().trim().min(1, "Option text cannot be empty"),
    isCorrect: z.number().int().min(0).max(1).default(0),
    position: z.number().int().min(0).default(0),
});

export const questionSchema = z.object({
    questionType: questionTypeEnum,
    questionText: z.string().trim().min(1, "Question text cannot be empty").max(2000),
    points: z.number().int().min(0, "Points must be >= 0").default(0),
    position: z.number().int().min(0, "Position must be >= 0").default(0),
    options: z.array(questionOptionSchema).min(1, "At least one option is required"),
});

export const questionUpdateSchema = z.object({
    questionType: questionTypeEnum.optional(),
    questionText: z.string().trim().min(1).max(2000).optional(),
    points: z.number().int().min(0).optional(),
    position: z.number().int().min(0).optional(),
    options: z.array(questionOptionSchema).optional(),
});

export const questionReorderSchema = z.object({
    order: z.array(z.string().uuid("Invalid question ID in order")).min(1, "Order must contain at least one question ID"),
});

export const questionParamsSchema = z.object({
    questionId: z.string().uuid("Invalid question ID format"),
});

export type QuestionInput = z.infer<typeof questionSchema>
export type QuestionUpdateInput = z.infer<typeof questionUpdateSchema>
export type QuestionReorderInput = z.infer<typeof questionReorderSchema>
export type QuestionOptionInput = z.infer<typeof questionOptionSchema>
export type QuestionParamsInput = z.infer<typeof questionParamsSchema>
