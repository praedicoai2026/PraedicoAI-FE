import { randomBytes, timingSafeEqual } from "node:crypto";
import { compare, hash } from "bcryptjs";
import { env } from "../../config/env.js";
import { HttpError } from "../../errors/http-error.js";
import type { RegistrationInput } from "./auth.schema.js";
import { hashToken } from "./auth-session.js";
import { Session } from "./session.model.js";
import { User } from "./user.model.js";

const bcryptCost = 12;

export async function registerUser(input: RegistrationInput) {
  const passwordHash = await hash(input.password, bcryptCost);

  try {
    const user = await User.create({
      fullName: input.fullName,
      email: input.email,
      passwordHash,
      phone: input.phone,
      accountType: input.accountType,
      courseCategory: input.courseCategory,
      courseName: input.courseName,
      companyName: input.accountType === "business" ? input.companyName : "",
      companyWebsite:
        input.accountType === "business" ? input.companyWebsite : "",
      companyDescription:
        input.accountType === "business" ? input.companyDescription : "",
      otherInformation: input.otherInformation,
      termsAcceptedAt: new Date(),
    });

    return {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };
  } catch (error) {
    if (isDuplicateEmailError(error)) {
      throw new HttpError(
        409,
        "EMAIL_ALREADY_REGISTERED",
        "An account with this email address already exists.",
      );
    }
    throw error;
  }
}

export async function authenticateUser(email: string, password: string) {
  const user = await User.findOne({ email });
  const matches = user
    ? await compare(password, user.passwordHash)
    : (await hash(password, bcryptCost), false);
  if (!user || !matches) {
    throw new HttpError(
      401,
      "INVALID_CREDENTIALS",
      "Email or password is incorrect.",
    );
  }

  return {
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    accountType: user.accountType,
  };
}

export async function issuePasswordReset(email: string) {
  const user = await User.findOne({ email });
  if (!user) return null;

  const token = randomBytes(32).toString("base64url");
  user.passwordResetTokenHash = hashToken(token);
  user.passwordResetExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
  await user.save();
  return token;
}

export async function resetPassword(token: string, password: string) {
  const user = await User.findOne({
    passwordResetTokenHash: hashToken(token),
    passwordResetExpiresAt: { $gt: new Date() },
  }).select("+passwordResetTokenHash +passwordResetExpiresAt");

  if (!user) {
    throw new HttpError(
      400,
      "INVALID_RESET_TOKEN",
      "This password reset link is invalid or has expired.",
    );
  }

  user.passwordHash = await hash(password, bcryptCost);
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpiresAt = undefined;
  await user.save();
  await Session.deleteMany({ userId: user._id });
}

export function isAuthorizedResetRequest(secret: string | undefined) {
  if (!secret) return false;
  const candidate = Buffer.from(secret);
  const expected = Buffer.from(env.AUTH_INTERNAL_SECRET);
  return (
    candidate.length === expected.length && timingSafeEqual(candidate, expected)
  );
}

function isDuplicateEmailError(
  error: unknown,
): error is { code: number; keyPattern: { email: number } } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000 &&
    "keyPattern" in error &&
    typeof error.keyPattern === "object" &&
    error.keyPattern !== null &&
    "email" in error.keyPattern
  );
}
