import { Router } from "express";
import {
  requireAnyPermission,
  requirePermission,
} from "../auth/authorization.js";
import {
  createProjectController,
  employeeReportController,
  getEmployeeSelfController,
  listEmployeesController,
  listProjectsController,
  saveEmployeeProfileController,
  updateEmployeeProfileController,
  updateProjectController,
} from "./employee.controller.js";

export const employeeRouter = Router();
export const projectRouter = Router();

employeeRouter.get(
  "/",
  requireAnyPermission("employees:read", "employees:manage"),
  listEmployeesController,
);
employeeRouter.get(
  "/me",
  requirePermission("employees:self:read"),
  getEmployeeSelfController,
);
employeeRouter.get(
  "/reports",
  requirePermission("reports:read"),
  employeeReportController,
);
employeeRouter.post(
  "/profiles",
  requirePermission("employees:manage"),
  saveEmployeeProfileController,
);
employeeRouter.patch(
  "/profiles/:userId",
  requirePermission("employees:manage"),
  updateEmployeeProfileController,
);

projectRouter.get(
  "/",
  requireAnyPermission(
    "projects:read",
    "projects:manage",
    "projects:self:read",
  ),
  listProjectsController,
);
projectRouter.post(
  "/",
  requirePermission("projects:manage"),
  createProjectController,
);
projectRouter.patch(
  "/:projectId",
  requirePermission("projects:manage"),
  updateProjectController,
);
