import { api, rawApi } from "@/lib/axios";

import type {
  LoginFormValues,
  RegisterFormValues,
} from "@/features/auth/schemas";

import type {
  AuthResponse,
  RefreshTokenResponse,
  User,
} from "@/features/auth/types";
import type { ApiResponse } from "@/types";

export type RegisterPayload = Omit<
  RegisterFormValues,
  "confirmPassword" | "terms"
>;

export async function loginApi(data: LoginFormValues): Promise<AuthResponse> {
  const body = await api.post<unknown, ApiResponse<AuthResponse>>(
    "/auth/login",
    data,
  );

  return body.data;
}

export async function registerApi(data: RegisterPayload): Promise<AuthResponse> {
  const body = await api.post<unknown, ApiResponse<AuthResponse>>(
    "/auth/register",
    data,
  );

  return body.data;
}

export async function refreshTokenApi(): Promise<RefreshTokenResponse> {
  const response =
    await rawApi.post<ApiResponse<RefreshTokenResponse>>("/auth/refresh");

  return response.data.data;
}

export async function getMeApi(): Promise<User> {
  const body = await api.get<unknown, ApiResponse<{ user: User }>>("/auth/me");

  return body.data.user;
}

export async function logoutApi(): Promise<void> {
  await api.post<unknown, ApiResponse<null>>("/auth/logout");
}

export async function deleteUserApi(): Promise<void> {
  await api.delete<unknown, ApiResponse<{ deleted: boolean }>>("/users/me");
}
