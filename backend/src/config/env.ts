import "dotenv/config";
import { z } from "zod";

const environmentSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
  FRONTEND_ORIGIN: z.string().url().default("http://localhost:3000"),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  MONGODB_URI: z.string().url(),
  AUTH_INTERNAL_SECRET: z.string().min(32),
});

export const env = environmentSchema.parse(process.env);
