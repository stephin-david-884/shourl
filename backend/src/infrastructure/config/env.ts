import dotenv from "dotenv";
dotenv.config();

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  
  ACCESS_TOKEN_MAX_AGE: z.coerce.number(),   
  REFRESH_TOKEN_MAX_AGE: z.coerce.number(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // console.error("Invalid environment variables", parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;