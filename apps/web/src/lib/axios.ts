import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import { useAuthStore } from "@/features/auth/store/auth.store";
import type { ApiResponse } from "@/types/api.type";
import type { RefreshTokenResponse } from "@/features/auth/types/auth.type";

type FailedRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const rawApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response.data,

  async (error: AxiosError) => {
    const originalRequest = error.config as FailedRequestConfig | undefined;

    const isUnauthorized = error.response?.status === 401;
    const isRetried = originalRequest?._retry;
    const requestUrl = originalRequest?.url ?? "";

    const isAuthEndpoint =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register") ||
      requestUrl.includes("/auth/refresh");

    if (!isUnauthorized || !originalRequest || isRetried || isAuthEndpoint) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const refreshResponse =
        await rawApi.post<ApiResponse<RefreshTokenResponse>>("/auth/refresh");

      const { accessToken } = refreshResponse.data.data;

      useAuthStore.getState().setAccessToken(accessToken);

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      useAuthStore.getState().clearAuth();

      return Promise.reject(refreshError);
    }
  },
);