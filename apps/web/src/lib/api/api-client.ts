import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';

import type { RefreshResponse } from '@/features/auth/types';
import { tokenStore } from '../utils/token';

const API_URL =
  import.meta.env.VITE_API_URL || '/api/v1';

/**
 * Main API client.
 */
export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Separate client for authentication operations.
 */
export const authClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Attach access token to every normal API request.
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStore.get();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Ensures that only one refresh request happens
 * when multiple requests receive 401 simultaneously.
 */
let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = async (): Promise<string> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = authClient
    .post<RefreshResponse>('/auth/refresh')
    .then((response) => {
      const newAccessToken =
        response.data.accessToken;

      tokenStore.set(newAccessToken);

      return newAccessToken;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

/**
 * Handle expired access tokens.
 */
apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest =
      error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      tokenStore.clear();

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newAccessToken =
        await refreshAccessToken();

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      tokenStore.clear();

      return Promise.reject(refreshError);
    }
  },
);