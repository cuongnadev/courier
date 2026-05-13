import { api } from "@/lib/axios";

import type { LoginSchema, RegisterSchema } from "@/features/auth/schemas/auth.schema";

export type RegisterPayload = Omit<
  RegisterSchema,
  "confirmPassword"
>;

export async function loginApi(data: LoginSchema) {
    const response = await api.post("/auth/login", data);

    return response.data;
}

export async function registerApi(data: RegisterPayload) {
    const response = await api.post("/auth/register", data);

    return response.data;
}