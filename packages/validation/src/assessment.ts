import z from "zod";

export const assessmentSchema = z.object({
    title: z.string().trim().min(2, "Title must be atleast 2 characters"),
    description: z.string().trim().optional(),
    durationMinutes: z.number().int().min(1, "Duration must be atleast 1 minute"),   
})

export const assessmentUpdateSchema = z.object({
    title: z.string().trim().min(2, "Title must be atleast 2 characters").optional(),
    description: z.string().trim().optional().optional(),
    durationMinutes: z.number().int().min(1, "Duration must be atleast 1 minute").optional(),  
})

export type AssessmentInput = z.infer<typeof assessmentSchema>