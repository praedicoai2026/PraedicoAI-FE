import "dotenv/config";
import { z } from "zod";

const environmentSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.coerce.number().int().min(1).max(65535).default(4000),
    LOG_LEVEL: z
      .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
      .default("info"),
    FRONTEND_ORIGIN: z.string().url().optional(),
    FRONTEND_ORIGINS: z
      .string()
      .default("https://praedicoai.com,http://localhost:3000"),
    DB_USER: z.string().min(1),
    DB_PASSWORD: z.string().min(1),
    MONGODB_URI: z.string().url(),
    AUTH_INTERNAL_SECRET: z.string().min(32),
    GEMINI_API_KEY: z
      .string()
      .trim()
      .transform((value) => value || undefined)
      .optional(),
    GEMINI_MODEL: z.string().trim().min(1).default("gemini-3.8-flash"),
    GEMINI_DEMO_RELEASE_STATUS: z
      .enum(["coming-soon", "beta", "live"])
      .default("coming-soon"),
    OTP_EXPIRY_MINUTES: z.coerce.number().int().min(1).max(1440).default(10),
    OTP_MAX_ATTEMPTS: z.coerce.number().int().min(1).max(100).default(5),
    OTP_RESEND_COOLDOWN_SECONDS: z.coerce
      .number()
      .int()
      .min(1)
      .max(86400)
      .default(60),
    DEMO_MAX_INPUT_CHARACTERS: z.coerce
      .number()
      .int()
      .min(100)
      .max(5000)
      .default(2000),
    DEMO_MAX_OUTPUT_TOKENS: z.coerce
      .number()
      .int()
      .min(100)
      .max(2000)
      .default(600),
  })
  .transform((parsed) => {
    const origins = [
      ...parsed.FRONTEND_ORIGINS.split(",").map((origin) => origin.trim()),
      ...(parsed.FRONTEND_ORIGIN ? [parsed.FRONTEND_ORIGIN] : []),
    ].filter(Boolean);

    return {
      ...parsed,
      FRONTEND_ORIGINS: z
        .array(z.string().url())
        .min(1)
        .parse([...new Set(origins)]),
    };
  });

export const env = environmentSchema.parse(process.env);
