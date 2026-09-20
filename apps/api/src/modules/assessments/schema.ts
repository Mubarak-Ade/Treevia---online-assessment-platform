import z from "zod";

export const assessmentParamsSchema = z.object({
    id: z.uuid("Invalid assessment ID format")
})

export const joinCodeParamsSchema = z.object({
    joinCode: z.string().min(1, "Join code is required").max(10, "Invalid join code format")
})

export type AssessmentParamsInput = z.infer<typeof assessmentParamsSchema>
export type JoinCodeParamsInput = z.infer<typeof joinCodeParamsSchema>