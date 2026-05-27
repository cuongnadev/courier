import { api, rawApi } from "@/lib/axios";

import type {
  LoginFormValues,
  RegisterFormValues,
} from "@/features/auth/schemas/auth.schema";
import type {
  AuthResponse,
  RefreshTokenResponse,
  User,
} from "@/features/auth/types/auth.type";
import type { ApiResponse } from "@/types/api.type";

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

export async function registerApi(
  data: RegisterFormValues,
): Promise<AuthResponse> {
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
  const body = await api.get<unknown, ApiResponse<User>>("/auth/me");

  return body.data;
}

export async function logoutApi(): Promise<void> {
  await api.post<unknown, ApiResponse<null>>("/auth/logout");
}