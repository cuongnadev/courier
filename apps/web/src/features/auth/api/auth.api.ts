import { api } from "@/lib/axios";

import type { LoginFormValues, RegisterFormValues } from "@/features/auth/schemas/auth.schema";

export type RegisterPayload = Omit<
  RegisterFormValues,
  "confirmPassword" | "terms"
>;

export async function loginApi(data: LoginFormValues) {
    const response = await api.post("/auth/login", data);

    return response.data;
}

export async function registerApi(data: RegisterPayload) {
    const response = await api.post("/auth/register", data);

    return response.data;
}

export async function getMeApi() {
  const response = await api.get("/auth/me");

  return response.data;
}

export async function refreshTokenApi() {
  const response = await api.post("/auth/refresh");

  return response.data;
}

export async function logoutApi() {
  const response = await api.post("/auth/logout");

  return response.data;
}