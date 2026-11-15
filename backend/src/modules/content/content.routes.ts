import { Router } from "express";
import { requirePermission } from "../auth/authorization.js";
import {
  createContentController,
  getPublicContentController,
  listPublicContentController,
  listContentController,
  updateContentController,
} from "./content.controller.js";

export const contentRouter = Router();

contentRouter.get(
  "/admin",
  requirePermission("content:read"),
  listContentController,
);
contentRouter.post(
  "/admin",
  requirePermission("content:manage"),
  createContentController,
);
contentRouter.patch(
  "/admin/:id",
  requirePermission("content:manage"),
  updateContentController,
);
contentRouter.get("/public", listPublicContentController);
contentRouter.get("/public/:slug", getPublicContentController);
