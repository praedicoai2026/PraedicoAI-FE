import type { RequestHandler } from "express";
import { isAuthorizedInternalRequest } from "../auth/auth.service.js";
import { env } from "../../config/env.js";
import { executeDemoSchema, trackDemoEventSchema } from "./demo.schema.js";
import {
  executeDemo,
  getDemoAnalytics,
  getDemoAvailability,
  trackDemoView,
} from "./demo.service.js";

export const getPublicDemoStatus: RequestHandler = (request, response) => {
  const countryCode = request.header("x-vercel-ip-country")?.toUpperCase();
  if (!countryCode || !/^[A-Z]{2}$/.test(countryCode)) {
    response.status(200).json({
      data: {
        available: false,
        status: "Coming Soon",
        reason: "region-unknown",
        maximumInputCharacters: env.DEMO_MAX_INPUT_CHARACTERS,
      },
    });
    return;
  }
  response.status(200).json({
    data: {
      ...getDemoAvailability(countryCode),
      maximumInputCharacters: env.DEMO_MAX_INPUT_CHARACTERS,
    },
  });
};

export const executePublicDemo: RequestHandler = async (
  request,
  response,
  next,
) => {
  if (!isAuthorizedInternalRequest(request.header("x-auth-internal-secret"))) {
    response.status(403).json({
      error: { code: "FORBIDDEN", message: "This request is not allowed." },
    });
    return;
  }
  const result = executeDemoSchema.safeParse(request.body);
  if (!result.success) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Check the demo input and required confirmations.",
      },
    });
    return;
  }
  if (result.data.input.length > env.DEMO_MAX_INPUT_CHARACTERS) {
    response.status(400).json({
      error: {
        code: "DEMO_INPUT_TOO_LONG",
        message: `Keep the prompt under ${env.DEMO_MAX_INPUT_CHARACTERS} characters.`,
      },
    });
    return;
  }
  try {
    const resultData = await executeDemo(result.data);
    response.status(200).json({ data: resultData });
  } catch (error) {
    next(error);
  }
};

export const trackPublicDemoView: RequestHandler = async (
  request,
  response,
  next,
) => {
  if (!isAuthorizedInternalRequest(request.header("x-auth-internal-secret"))) {
    response.status(403).json({
      error: { code: "FORBIDDEN", message: "This request is not allowed." },
    });
    return;
  }
  const result = trackDemoEventSchema.safeParse(request.body);
  if (!result.success) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "The demo view could not be recorded.",
      },
    });
    return;
  }
  try {
    await trackDemoView(result.data);
    response.status(202).json({ data: { recorded: true } });
  } catch (error) {
    next(error);
  }
};

export const getAdminDemoAnalytics: RequestHandler = async (
  _request,
  response,
  next,
) => {
  try {
    response.status(200).json({ data: await getDemoAnalytics() });
  } catch (error) {
    next(error);
  }
};
