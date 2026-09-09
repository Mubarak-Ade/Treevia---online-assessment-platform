import { authClient, apiClient } from "@/lib/api";
import { LoginInput, AuthResponse, RefreshResponse, User, RegisterInput } from "./types";

export const authApi = {
    login: async (input: LoginInput): Promise<AuthResponse> => {
        const response = await authClient.post<AuthResponse>('/auth/login', input);

        return response.data;
    },

    register: async (input: RegisterInput): Promise<AuthResponse> => {
        const response = await authClient.post<AuthResponse>('/auth/register', input);

        return response.data;
    },

    refresh: async (): Promise<RefreshResponse> => {
        const response = await authClient.post<RefreshResponse>('/auth/refresh');

        return response.data;
    },

    me: async (): Promise<User> => {
        const response = await apiClient.get<User>('/auth/me');

        return response.data;
    },

    logout: async (): Promise<void> => {
        await authClient.post('/auth/logout');
    },
};
    