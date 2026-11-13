import cors from "cors";
import express from "express";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { isDatabaseConnected, pingDatabase } from "./db/mongoose.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";
import { authRouter } from "./modules/auth/auth.routes.js";

export const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  }),
);
app.use(express.json({ limit: "10kb" }));
app.use(
  pinoHttp({
    logger,
    customLogLevel(_request, response, error) {
      if (error || response.statusCode >= 500) return "error";
      if (response.statusCode >= 400) return "warn";
      return "info";
    },
  }),
);

app.get("/health/live", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

app.get("/health/ready", async (_request, response, next) => {
  try {
    if (!isDatabaseConnected()) {
      response.status(503).json({ status: "not-ready" });
      return;
    }
    await pingDatabase();
    response.status(200).json({ status: "ready" });
  } catch (error) {
    next(error);
  }
});

app.use("/api/v1/auth", authRouter);
app.use(notFoundHandler);
app.use(errorHandler);
