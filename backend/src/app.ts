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
import { leadRouter } from "./modules/leads/lead.routes.js";
import { demoRouter } from "./modules/demos/demo.routes.js";
import { adminRouter } from "./modules/admin/admin.routes.js";
import {
  employeeRouter,
  projectRouter,
} from "./modules/employees/employee.routes.js";
import { reportsRouter } from "./modules/reports/reports.routes.js";
import { contentRouter } from "./modules/content/content.routes.js";

export const app = express();

app.disable("x-powered-by");
if (env.NODE_ENV === "production") app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_ORIGINS,
    methods: ["GET", "POST", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-Auth-Internal-Secret"],
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

app.get("/health", (_request, response) => {
  response.status(200).json({
    status: "ok",
    service: "praedicoai-backend",
  });
});

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
app.use("/api/v1/leads", leadRouter);
app.use("/api/v1/demos", demoRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/employees", employeeRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/reports", reportsRouter);
app.use("/api/v1/content", contentRouter);
app.use(notFoundHandler);
app.use(errorHandler);
