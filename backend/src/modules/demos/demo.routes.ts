import { Router } from "express";
import { ipKeyGenerator, rateLimit } from "express-rate-limit";
import { requirePermission } from "../auth/authorization.js";
import {
  executePublicDemo,
  getAdminDemoAnalytics,
  getPublicDemoStatus,
  trackPublicDemoView,
} from "./demo.controller.js";

export const demoRouter = Router();

const demoExecutionRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  keyGenerator: (request) => {
    const key = request.body?.rateLimitKey;
    return typeof key === "string" && /^[a-f0-9]{64}$/.test(key)
      ? key
      : request.ip
        ? ipKeyGenerator(request.ip)
        : "unknown";
  },
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: {
      code: "DEMO_RATE_LIMITED",
      message: "Demo usage is limited. Please try again later.",
    },
  },
});

const demoViewRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  keyGenerator: (request) => {
    const key = request.body?.rateLimitKey;
    return typeof key === "string" && /^[a-f0-9]{64}$/.test(key)
      ? key
      : request.ip
        ? ipKeyGenerator(request.ip)
        : "unknown";
  },
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

demoRouter.get("/status", getPublicDemoStatus);
demoRouter.post("/execute", demoExecutionRateLimit, executePublicDemo);
demoRouter.post("/track", demoViewRateLimit, trackPublicDemoView);
demoRouter.get(
  "/admin/analytics",
  requirePermission("demos:read"),
  getAdminDemoAnalytics,
);
