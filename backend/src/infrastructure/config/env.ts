import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),

  ACCESS_TOKEN_MAX_AGE: z.coerce.number(),
  REFRESH_TOKEN_MAX_AGE: z.coerce.number(),

  SHORT_CODE_LENGTH: z.coerce.number().int().positive(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // console.error("Invalid environment variables", parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;