import { apiClient } from "@/lib/api"
import { Question, QuestionInput, QuestionUpdateInput, QuestionReorderInput } from "./types"

export const questionApi = {
    getByAssessmentId: async (assessmentId: string): Promise<Question[]> => {
        const response = await apiClient.get<Question[]>(`/assessments/${assessmentId}/questions`)
        return response.data
    },

    create: async (assessmentId: string, data: QuestionInput): Promise<Question> => {
        const response = await apiClient.post<Question>(`/assessments/${assessmentId}/questions`, data)
        return response.data
    },

    update: async (assessmentId: string, questionId: string, data: QuestionUpdateInput): Promise<Question> => {
        const response = await apiClient.put<Question>(`/assessments/${assessmentId}/questions/${questionId}`, data)
        return response.data
    },

    delete: async (assessmentId: string, questionId: string): Promise<void> => {
        await apiClient.delete(`/assessments/${assessmentId}/questions/${questionId}`)
    },

    reorder: async (assessmentId: string, data: QuestionReorderInput): Promise<void> => {
        await apiClient.patch(`/assessments/${assessmentId}/questions/reorder`, data)
    },
}
