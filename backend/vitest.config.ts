import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    env: {
      NODE_ENV: "test",
      LOG_LEVEL: "silent",
      FRONTEND_ORIGIN: "https://legacy.example",
      FRONTEND_ORIGINS: "https://praedicoai.com,http://localhost:3000",
      DB_USER: "praedicoai_test",
      DB_PASSWORD: "praedicoai_test",
      MONGODB_URI: "mongodb://localhost:27017/praedicoai_test",
      AUTH_INTERNAL_SECRET: "test-only-internal-secret-change-me-123456",
      OTP_EXPIRY_MINUTES: "10",
      OTP_MAX_ATTEMPTS: "5",
      OTP_RESEND_COOLDOWN_SECONDS: "60",
    },
  },
});
