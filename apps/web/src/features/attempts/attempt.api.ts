import axios from "axios"
import { Attempt, AttemptDetail, AttemptQuestion, CreateAttemptPayload, SaveAnswerPayload } from "./types"

const API_URL = import.meta.env.VITE_API_URL || '/api/v1'

function getAttemptClient(attemptId: string) {
    const token = localStorage.getItem(`attempt_token_${attemptId}`)
    return axios.create({
        baseURL: API_URL,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    })
}

export const attemptApi = {
    create: async (data: CreateAttemptPayload): Promise<Attempt> => {
        const response = await axios.post<Attempt>(`${API_URL}/attempts`, data, {
            headers: { 'Content-Type': 'application/json' },
        })
        return response.data
    },
    getAttempt: async (attemptId: string): Promise<AttemptDetail> => {
        const client = getAttemptClient(attemptId)
        const response = await client.get<AttemptDetail>(`/attempts/${attemptId}`)
        return response.data
    },
    getQuestions: async (attemptId: string): Promise<AttemptQuestion[]> => {
        const client = getAttemptClient(attemptId)
        const response = await client.get<AttemptQuestion[]>(`/attempts/${attemptId}/questions`)
        return response.data
    },
    getAnswers: async (attemptId: string): Promise<Record<string, string>> => {
        const client = getAttemptClient(attemptId)
        const response = await client.get<Record<string, string>>(`/attempts/${attemptId}/answers`)
        return response.data
    },
    saveAnswer: async (attemptId: string, data: SaveAnswerPayload): Promise<void> => {
        const client = getAttemptClient(attemptId)
        await client.patch(`/attempts/${attemptId}/answers`, data)
    },
    bulkSaveAnswers: async (attemptId: string, answers: SaveAnswerPayload[]): Promise<void> => {
        const client = getAttemptClient(attemptId)
        await client.patch(`/attempts/${attemptId}/answers/bulk`, { answers })
    },
    submit: async (attemptId: string): Promise<Attempt> => {
        const client = getAttemptClient(attemptId)
        const response = await client.post<Attempt>(`/attempts/${attemptId}/submit`)
        return response.data
    },
}
