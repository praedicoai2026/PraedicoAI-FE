import type { RequestHandler } from "express";
import { isAuthorizedInternalRequest } from "../auth/auth.service.js";
import { contactOtpActionSchema } from "./contact-otp.schema.js";
import {
  claimContactOtp,
  consumeContactOtp,
  createContactOtp,
  discardContactOtp,
  releaseContactOtp,
  verifyContactOtp,
} from "./contact-otp.service.js";

export const contactOtpController: RequestHandler = async (
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

  const parsed = contactOtpActionSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Check the verification request and try again.",
      },
    });
    return;
  }

  try {
    switch (parsed.data.action) {
      case "request": {
        const result = await createContactOtp(parsed.data.email);
        if ("retryAfterSeconds" in result) {
          response.status(429).json({
            error: {
              code: "OTP_COOLDOWN",
              message:
                "Please wait before requesting another verification code.",
              retryAfterSeconds: result.retryAfterSeconds,
            },
          });
          return;
        }
        response.status(201).json({ data: result });
        return;
      }
      case "verify": {
        const verified = await verifyContactOtp(
          parsed.data.challengeId,
          parsed.data.code,
        );
        response.status(200).json({ data: { verified } });
        return;
      }
      case "claim": {
        const claimed = await claimContactOtp(
          parsed.data.challengeId,
          parsed.data.email,
        );
        response.status(200).json({ data: { claimed } });
        return;
      }
      case "release":
        await releaseContactOtp(parsed.data.challengeId, parsed.data.email);
        response.status(200).json({ data: { released: true } });
        return;
      case "consume":
        await consumeContactOtp(parsed.data.challengeId, parsed.data.email);
        response.status(200).json({ data: { consumed: true } });
        return;
      case "discard":
        await discardContactOtp(parsed.data.challengeId);
        response.status(200).json({ data: { discarded: true } });
    }
  } catch (error) {
    next(error);
  }
};
