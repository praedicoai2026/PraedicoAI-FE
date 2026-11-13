import type { RequestHandler } from "express";
import {
  loginSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
  registrationSchema,
} from "./auth.schema.js";
import {
  authenticateUser,
  isAuthorizedResetRequest,
  issuePasswordReset,
  registerUser,
  resetPassword,
} from "./auth.service.js";
import {
  createSession,
  destroySession,
  getSessionUser,
} from "./auth-session.js";

export const register: RequestHandler = async (request, response, next) => {
  const result = registrationSchema.safeParse(request.body);
  if (!result.success) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Check the submitted information and try again.",
        fields: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
    return;
  }

  try {
    const user = await registerUser(result.data);
    response.status(201).json({ data: { user } });
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (request, response, next) => {
  const result = loginSchema.safeParse(request.body);
  if (!result.success) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Enter a valid email address and password.",
      },
    });
    return;
  }

  try {
    const user = await authenticateUser(
      result.data.email,
      result.data.password,
    );
    await createSession(user.id, response);
    response.status(200).json({ data: { user } });
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = async (request, response, next) => {
  try {
    await destroySession(request, response);
    response.status(200).json({ data: { message: "Signed out." } });
  } catch (error) {
    next(error);
  }
};

export const currentUser: RequestHandler = async (request, response, next) => {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      response.status(401).json({
        error: { code: "UNAUTHENTICATED", message: "Sign in to continue." },
      });
      return;
    }
    response.status(200).json({ data: { user } });
  } catch (error) {
    next(error);
  }
};

export const requestPasswordReset: RequestHandler = async (
  request,
  response,
  next,
) => {
  if (!isAuthorizedResetRequest(request.header("x-auth-internal-secret"))) {
    response.status(403).json({
      error: { code: "FORBIDDEN", message: "This request is not allowed." },
    });
    return;
  }

  const result = passwordResetRequestSchema.safeParse(request.body);
  if (!result.success) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Enter a valid email address.",
      },
    });
    return;
  }

  try {
    const token = await issuePasswordReset(result.data.email);
    response.status(200).json({ data: { token } });
  } catch (error) {
    next(error);
  }
};

export const confirmPasswordReset: RequestHandler = async (
  request,
  response,
  next,
) => {
  const result = passwordResetSchema.safeParse(request.body);
  if (!result.success) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message:
          "Enter a valid reset token and a password of at least 12 characters.",
      },
    });
    return;
  }

  try {
    await resetPassword(result.data.token, result.data.password);
    response.status(200).json({
      data: { message: "Your password has been reset." },
    });
  } catch (error) {
    next(error);
  }
};
