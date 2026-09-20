import z from "zod";

export const attemptParamsSchema = z.object({
    attemptId: z.uuid("Invalid attempt ID format"),
});

export type AttemptParamsInput = z.infer<typeof attemptParamsSchema>;
