import type { RequestHandler } from "express";
import { getSessionUser } from "./auth-session.js";
import { hasPermission, type AdminPermission } from "./roles.js";

export const requirePermission = (
  permission: AdminPermission,
): RequestHandler => {
  return async (request, response, next) => {
    try {
      const user = await getSessionUser(request);
      if (!user) {
        response.status(401).json({
          error: {
            code: "UNAUTHENTICATED",
            message: "Sign in to continue.",
          },
        });
        return;
      }
      if (!hasPermission(user, permission)) {
        response.status(403).json({
          error: {
            code: "FORBIDDEN",
            message: "You do not have permission to perform this action.",
          },
        });
        return;
      }
      response.locals.adminUser = user;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const requireAnyPermission = (
  ...permissions: AdminPermission[]
): RequestHandler => {
  return async (request, response, next) => {
    try {
      const user = await getSessionUser(request);
      if (!user) {
        response.status(401).json({
          error: {
            code: "UNAUTHENTICATED",
            message: "Sign in to continue.",
          },
        });
        return;
      }
      if (!permissions.some((permission) => hasPermission(user, permission))) {
        response.status(403).json({
          error: {
            code: "FORBIDDEN",
            message: "You do not have permission to perform this action.",
          },
        });
        return;
      }
      response.locals.adminUser = user;
      next();
    } catch (error) {
      next(error);
    }
  };
};
