import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { logger } from "../config/logger.js";
import { HttpError } from "../errors/http-error.js";

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _request,
  response,
  _next,
) => {
  if (error instanceof HttpError) {
    response.status(error.statusCode).json({
      error: { code: error.code, message: error.message },
    });
    return;
  }

  if (error instanceof ZodError) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Check the submitted information and try again.",
        fields: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
    return;
  }

  if (isRequestBodyError(error)) {
    response.status(error.status).json({
      error: {
        code: error.status === 413 ? "REQUEST_TOO_LARGE" : "INVALID_REQUEST",
        message:
          error.status === 413
            ? "The request is too large."
            : "The request body must contain valid JSON.",
      },
    });
    return;
  }

  logger.error({ err: error }, "Unhandled API error");
  response.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred.",
    },
  });
};

function isRequestBodyError(
  error: unknown,
): error is Error & { status: number } {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof error.status === "number" &&
    (error.status === 400 || error.status === 413)
  );
}
