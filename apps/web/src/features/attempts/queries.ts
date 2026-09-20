import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { attemptApi } from "./attempt.api"
import { Attempt, AttemptDetail, CreateAttemptPayload, SaveAnswerPayload } from "./types"
import { toast } from "sonner"

export const attemptKeys = {
    byId: (id: string) => ['attempts', id] as const,
    detail: (id: string) => ['attempts', id, 'detail'] as const,
    questions: (id: string) => ['attempts', id, 'questions'] as const,
    answers: (id: string) => ['attempts', id, 'answers'] as const,
}

export const useCreateAttempt = () => {
    return useMutation<Attempt, Error, CreateAttemptPayload>({
        mutationFn: attemptApi.create,
        onError: (error) => {
            toast.error(error.message || "Failed to create attempt")
        }
    })
}

export const useAttemptDetail = (attemptId: string) => {
    return useQuery({
        queryKey: attemptKeys.detail(attemptId),
        queryFn: () => attemptApi.getAttempt(attemptId),
        enabled: !!attemptId,
        refetchInterval: false,
    })
}

export const useAttemptQuestions = (attemptId: string) => {
    return useQuery({
        queryKey: attemptKeys.questions(attemptId),
        queryFn: () => attemptApi.getQuestions(attemptId),
        enabled: !!attemptId,
    })
}

export const useAttemptAnswers = (attemptId: string) => {
    return useQuery({
        queryKey: attemptKeys.answers(attemptId),
        queryFn: () => attemptApi.getAnswers(attemptId),
        enabled: !!attemptId,
    })
}

export const useSaveAnswer = () => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, { attemptId: string; data: SaveAnswerPayload }>({
        mutationFn: ({ attemptId, data }) => attemptApi.saveAnswer(attemptId, data),
        onSuccess: (_, { attemptId }) => {
            queryClient.invalidateQueries({ queryKey: attemptKeys.answers(attemptId) })
        },
        onError: () => {
            toast.error("Failed to save answer")
        }
    })
}

export const useSubmitAttempt = () => {
    const queryClient = useQueryClient()

    return useMutation<Attempt, Error, string>({
        mutationFn: attemptApi.submit,
        onSuccess: (_, attemptId) => {
            queryClient.invalidateQueries({ queryKey: attemptKeys.byId(attemptId) })
            toast.success("Assessment submitted successfully")
        },
        onError: () => {
            toast.error("Failed to submit assessment")
        }
    })
}
