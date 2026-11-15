import { Router } from "express";
import { requirePermission } from "../auth/authorization.js";
import { dashboardAnalyticsController } from "./dashboard.controller.js";

export const reportsRouter = Router();

reportsRouter.get(
  "/dashboard",
  requirePermission("reports:read"),
  dashboardAnalyticsController,
);
