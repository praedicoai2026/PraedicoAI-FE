import type { RequestHandler } from "express";
import { hasPermission } from "../auth/roles.js";
import {
  contentCreateSchema,
  contentUpdateSchema,
} from "./content.schema.js";
import {
  createContent,
  getPublishedContent,
  listManagedContent,
  listPublishedContent,
  updateContent,
} from "./content.service.js";

type ContentActor = { id: string; email: string; role: "super_admin" | "admin" | "content_manager"; permissions: string[] };

function mayPublish(response: Parameters<RequestHandler>[1]) {
  const actor = response.locals.adminUser as ContentActor | undefined;
  return Boolean(actor && hasPermission(actor, "content:publish"));
}

export const listContentController: RequestHandler = async (
  _request,
  response,
  next,
) => {
  try {
    response.status(200).json({ data: { entries: await listManagedContent() } });
  } catch (error) {
    next(error);
  }
};

export const createContentController: RequestHandler = async (
  request,
  response,
  next,
) => {
  const parsed = contentCreateSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Check the content entry fields.",
        fields: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
    return;
  }
  if (
    (parsed.data.status === "published" || parsed.data.status === "archived") &&
    !mayPublish(response)
  ) {
    response.status(403).json({
      error: { code: "FORBIDDEN", message: "Publishing requires reviewer access." },
    });
    return;
  }
  try {
    const actor = response.locals.adminUser as ContentActor;
    const entry = await createContent(parsed.data, actor.id);
    response.status(201).json({ data: { entry } });
  } catch (error) {
    next(error);
  }
};

export const updateContentController: RequestHandler = async (
  request,
  response,
  next,
) => {
  const parsed = contentUpdateSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Check the content changes.",
        fields: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
    return;
  }
  if (
    (parsed.data.status === "published" || parsed.data.status === "archived") &&
    !mayPublish(response)
  ) {
    response.status(403).json({
      error: { code: "FORBIDDEN", message: "Publishing requires reviewer access." },
    });
    return;
  }
  const id = request.params.id;
  if (typeof id !== "string") {
    response.status(404).json({
      error: { code: "CONTENT_NOT_FOUND", message: "Content entry not found." },
    });
    return;
  }
  try {
    const actor = response.locals.adminUser as ContentActor;
    const entry = await updateContent(id, parsed.data, actor.id);
    response.status(200).json({ data: { entry } });
  } catch (error) {
    next(error);
  }
};

export const getPublicContentController: RequestHandler = async (
  request,
  response,
  next,
) => {
  const slug = request.params.slug;
  if (typeof slug !== "string") {
    response.status(404).json({ error: { message: "Content not found." } });
    return;
  }
  try {
    const entry = await getPublishedContent(slug);
    if (!entry) {
      response.status(404).json({ error: { message: "Content not found." } });
      return;
    }
    response.status(200).json({ data: { entry } });
  } catch (error) {
    next(error);
  }
};

export const listPublicContentController: RequestHandler = async (
  _request,
  response,
  next,
) => {
  try {
    response
      .status(200)
      .json({ data: { entries: await listPublishedContent() } });
  } catch (error) {
    next(error);
  }
};
