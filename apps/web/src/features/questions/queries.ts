import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { questionApi } from "./api"
import { Question, QuestionInput, QuestionUpdateInput, QuestionReorderInput } from "./types"
import { toast } from "sonner"

export const questionKeys = {
    all: ['questions'] as const,
    byAssessmentId: (assessmentId: string) => ['questions', assessmentId] as const,
}

export const useQuestions = (assessmentId: string) => {
    return useQuery<Question[]>({
        queryKey: questionKeys.byAssessmentId(assessmentId),
        queryFn: () => questionApi.getByAssessmentId(assessmentId),
        enabled: !!assessmentId,
    })
}

export const useCreateQuestion = () => {
    const queryClient = useQueryClient()

    return useMutation<Question, Error, { assessmentId: string; data: QuestionInput }>({
        mutationFn: ({ assessmentId, data }) => questionApi.create(assessmentId, data),
        onSuccess: (_, { assessmentId }) => {
            queryClient.invalidateQueries({ queryKey: questionKeys.byAssessmentId(assessmentId) })
            toast.success("Question created successfully")
        },
        onError: () => {
            toast.error("Failed to create question")
        },
    })
}

export const useUpdateQuestion = () => {
    const queryClient = useQueryClient()

    return useMutation<Question, Error, { assessmentId: string; questionId: string; data: QuestionUpdateInput }>({
        mutationFn: ({ assessmentId, questionId, data }) => questionApi.update(assessmentId, questionId, data),
        onSuccess: (_, { assessmentId }) => {
            queryClient.invalidateQueries({ queryKey: questionKeys.byAssessmentId(assessmentId) })
            toast.success("Question updated successfully")
        },
        onError: () => {
            toast.error("Failed to update question")
        },
    })
}

export const useDeleteQuestion = () => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, { assessmentId: string; questionId: string }>({
        mutationFn: ({ assessmentId, questionId }) => questionApi.delete(assessmentId, questionId),
        onSuccess: (_, { assessmentId }) => {
            queryClient.invalidateQueries({ queryKey: questionKeys.byAssessmentId(assessmentId) })
            toast.success("Question deleted successfully")
        },
        onError: () => {
            toast.error("Failed to delete question")
        },
    })
}

export const useReorderQuestions = () => {
    const queryClient = useQueryClient()

    return useMutation<void, Error, { assessmentId: string; data: QuestionReorderInput }>({
        mutationFn: ({ assessmentId, data }) => questionApi.reorder(assessmentId, data),
        onSuccess: (_, { assessmentId }) => {
            queryClient.invalidateQueries({ queryKey: questionKeys.byAssessmentId(assessmentId) })
            toast.success("Questions reordered successfully")
        },
        onError: () => {
            toast.error("Failed to reorder questions")
        },
    })
}
