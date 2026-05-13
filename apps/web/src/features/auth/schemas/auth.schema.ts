import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email("Invalid email address"),

    password: z
        .string()
        .trim()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
    .object({
        fullName: z
            .string()
            .trim()
            .min(1, "Full name is required"),

        email: z
            .string()
            .trim()
            .min(1, "Email is required")
            .email("Invalid email address"),

        password: z
            .string()
            .trim()
            .min(1, "Password is required")
            .min(6, "Password must be at least 6 characters"),

        confirmPassword: z
            .string()
            .trim()
            .min(1, "Confirm password is required"),

        terms: z.boolean().refine((value) => value === true, {
            message: "You must accept the terms",
        }),
    })

    .refine(
        (data) => data.password === data.confirmPassword,
        {
            path: ["confirmPassword"],
            message: "Passwords do not match",
        }
    );


export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;