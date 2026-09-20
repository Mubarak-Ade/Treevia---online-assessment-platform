import { apiClient } from "@/lib/api"
import { AssessmentInput } from "@treevia/validation"
import { Assessment } from "./types"

export interface AssessmentLookup {
    id: string;
    title: string;
    description: string | null;
    durationMinutes: number;
    questionCount: number;
    totalPoints: number;
    joinCode: string;
}

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
        const response = await apiClient.patch<Assessment>(`/assessments/${id}/publish`)
        return response.data
    },
    unpublish: async (id: string): Promise<Assessment> => {
        const response = await apiClient.patch<Assessment>(`/assessments/${id}/unpublish`)
        return response.data
    },
    close: async (id: string): Promise<Assessment> => {
        const response = await apiClient.patch<Assessment>(`/assessments/${id}/close`)
        return response.data
    },
    lookupByJoinCode: async (joinCode: string): Promise<AssessmentLookup> => {
        const response = await apiClient.get<AssessmentLookup>(`/assessments/join/${encodeURIComponent(joinCode)}`)
        return response.data
    },
    getParticipants: async (id: string): Promise<Participant[]> => {
        const response = await apiClient.get<Participant[]>(`/assessments/${id}/participants`)
        return response.data
    }
}

export interface Participant {
    id: string;
    studentName: string;
    studentId: string;
    studentEmail: string;
    status: string;
    startedAt: string;
    submittedAt: string | null;
}