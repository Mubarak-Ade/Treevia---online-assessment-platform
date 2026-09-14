import z from "zod";

export const assessmentParamsSchema = z.object({
    id: z.uuid("Invalid assessment ID format")
})

export type AssessmentParamsInput = z.infer<typeof assessmentParamsSchema>