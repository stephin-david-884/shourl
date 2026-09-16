import { z } from "zod";

export const createShortUrlSchema = z.object({
    originalUrl: z
        .string()
        .trim()
        .min(1, "URL is required")
        .url("Enter a valid URL"),
});
