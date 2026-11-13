import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import {
  confirmPasswordReset,
  currentUser,
  login,
  logout,
  register,
  requestPasswordReset,
} from "./auth.controller.js";

export const authRouter = Router();

const registrationRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: {
      code: "RATE_LIMITED",
      message: "Too many registration attempts. Please try again later.",
    },
  },
});

const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: {
      code: "RATE_LIMITED",
      message: "Too many sign-in attempts. Please try again later.",
    },
  },
});

const passwordResetRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: {
      code: "RATE_LIMITED",
      message: "Too many password reset attempts. Please try again later.",
    },
  },
});

authRouter.post("/register", registrationRateLimit, register);
authRouter.post("/login", loginRateLimit, login);
authRouter.post("/logout", logout);
authRouter.get("/me", currentUser);
authRouter.post("/password-reset/request", requestPasswordReset);
authRouter.post(
  "/password-reset/confirm",
  passwordResetRateLimit,
  confirmPasswordReset,
);
