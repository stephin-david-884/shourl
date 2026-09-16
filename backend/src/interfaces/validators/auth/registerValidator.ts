import { z } from "zod";

export const registerSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, "Name must be at least 2 characters")
            .regex(
                /^[A-Za-z]+( [A-Za-z]+)*$/,
                "Name can contain only letters and spaces",
            ),

        email: z
            .string()
            .trim()
            .min(1, "Email is required")
            .email("Invalid email address"),

        password: z
            .string()
            .min(
                6,
                "Password must contain at least 6 characters",
            )
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/,
                "Password must contain uppercase, lowercase, number and special character",
            ),

        confirmPassword: z.string(),
    })
    .superRefine((data, ctx) => {
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                message: "Passwords do not match",
                path: ["confirmPassword"],
            });
        }
    });

export type RegisterBody =
    z.infer<typeof registerSchema>;