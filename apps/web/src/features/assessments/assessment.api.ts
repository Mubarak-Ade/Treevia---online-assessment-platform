import { apiClient } from "@/lib/api"
import { AssessmentInput } from "@treevia/validation"
import { Assessment } from "./types"

export const assessmentApi = {
    getAll: async () => {
        const response = await apiClient.get<Assessment[]>('/assessments/')
        return response.data
    },
    getById: async (id: string) => {
        const response = await apiClient.get<Assessment>(`/assessments/${id}`)
        return response.data
    },
    create: async (data: AssessmentInput): Promise<Assessment> => {
        const response = await apiClient.post<Assessment>('/assessments/', data)
        return response.data
    },
    update: async (id: string, data: AssessmentInput): Promise<Assessment> => {
        const response = await apiClient.put<Assessment>(`/assessments/${id}`, data)
        return response.data
    },
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/assessments/${id}`)
    },
    publish: async (id: string): Promise<Assessment> => {
        const response = await apiClient.patch<Assessment>(`/assessments/publish/${id}`)
        return response.data
    },
    close: async (id: string): Promise<Assessment> => {
        const response = await apiClient.patch<Assessment>(`/assessments/close/${id}`)
        return response.data
    }
}