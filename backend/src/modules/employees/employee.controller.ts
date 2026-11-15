import type { RequestHandler } from "express";
import { Types } from "mongoose";
import {
  employeeProfileUpdateSchema,
  employeeProfileUpsertSchema,
  projectCreateSchema,
  projectUpdateSchema,
} from "./employee.schema.js";
import {
  createProject,
  getEmployeeReport,
  getEmployeeSelf,
  listEmployees,
  listProjects,
  saveEmployeeProfile,
  updateEmployeeProfile,
  updateProject,
} from "./employee.service.js";

type EmployeeActor = { id: string; permissions?: string[] };

export const listEmployeesController: RequestHandler = async (
  _request,
  response,
  next,
) => {
  try {
    response.status(200).json({ data: { employees: await listEmployees() } });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeSelfController: RequestHandler = async (
  _request,
  response,
  next,
) => {
  try {
    const actor = response.locals.adminUser as EmployeeActor;
    response
      .status(200)
      .json({ data: { employee: await getEmployeeSelf(actor.id) } });
  } catch (error) {
    next(error);
  }
};

export const saveEmployeeProfileController: RequestHandler = async (
  request,
  response,
  next,
) => {
  const parsed = employeeProfileUpsertSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Check the employee profile fields.",
        fields: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
    return;
  }
  try {
    const profile = await saveEmployeeProfile(parsed.data);
    response.status(200).json({ data: { profile } });
  } catch (error) {
    next(error);
  }
};

export const updateEmployeeProfileController: RequestHandler = async (
  request,
  response,
  next,
) => {
  const parsed = employeeProfileUpdateSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Check the employee profile changes.",
        fields: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
    return;
  }
  const userId = request.params.userId;
  if (typeof userId !== "string" || !Types.ObjectId.isValid(userId)) {
    response.status(404).json({
      error: { code: "EMPLOYEE_NOT_FOUND", message: "Employee not found." },
    });
    return;
  }
  try {
    const profile = await updateEmployeeProfile(userId, parsed.data);
    response.status(200).json({ data: { profile } });
  } catch (error) {
    next(error);
  }
};

export const listProjectsController: RequestHandler = async (
  _request,
  response,
  next,
) => {
  try {
    const actor = response.locals.adminUser as EmployeeActor;
    response
      .status(200)
      .json({ data: { projects: await listProjects(actor) } });
  } catch (error) {
    next(error);
  }
};

export const createProjectController: RequestHandler = async (
  request,
  response,
  next,
) => {
  const parsed = projectCreateSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Check the project details.",
        fields: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
    return;
  }
  try {
    const actor = response.locals.adminUser as EmployeeActor;
    const project = await createProject(parsed.data, actor.id);
    response.status(201).json({ data: { project } });
  } catch (error) {
    next(error);
  }
};

export const updateProjectController: RequestHandler = async (
  request,
  response,
  next,
) => {
  const parsed = projectUpdateSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Check the project changes.",
        fields: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
    return;
  }
  const projectId = request.params.projectId;
  if (typeof projectId !== "string" || !Types.ObjectId.isValid(projectId)) {
    response.status(404).json({
      error: { code: "PROJECT_NOT_FOUND", message: "Project not found." },
    });
    return;
  }
  try {
    const project = await updateProject(projectId, parsed.data);
    response.status(200).json({ data: { project } });
  } catch (error) {
    next(error);
  }
};

export const employeeReportController: RequestHandler = async (
  _request,
  response,
  next,
) => {
  try {
    response.status(200).json({ data: await getEmployeeReport() });
  } catch (error) {
    next(error);
  }
};
