import {
  createHmac,
  randomBytes,
  randomInt,
  timingSafeEqual,
} from "node:crypto";
import { env } from "../../config/env.js";
import { ContactOtpChallenge } from "./contact-otp.model.js";

const claimLeaseMilliseconds = 60_000;
const issueRetryLimit = 5;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function hashCode(code: string) {
  return createHmac("sha256", env.AUTH_INTERNAL_SECRET)
    .update(code)
    .digest("hex");
}

function hasDuplicateKey(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}

export async function createContactOtp(email: string, now = new Date()) {
  const normalizedEmail = normalizeEmail(email);
  const cooldownMilliseconds = env.OTP_RESEND_COOLDOWN_SECONDS * 1000;

  for (let attempt = 0; attempt < issueRetryLimit; attempt += 1) {
    const existing = await ContactOtpChallenge.findOne({
      email: normalizedEmail,
    }).lean();
    if (existing) {
      const retryAfterMilliseconds =
        existing.sentAt.getTime() + cooldownMilliseconds - now.getTime();
      if (retryAfterMilliseconds > 0) {
        return {
          retryAfterSeconds: Math.ceil(retryAfterMilliseconds / 1000),
        };
      }
    }

    const challengeId = randomBytes(32).toString("hex");
    const code = randomInt(100_000, 1_000_000).toString();
    const expiresAt = new Date(now.getTime() + env.OTP_EXPIRY_MINUTES * 60_000);
    const fields = {
      email: normalizedEmail,
      challengeId,
      codeHash: hashCode(code),
      expiresAt,
      sentAt: now,
      attempts: 0,
      verifiedAt: null,
      claimedAt: null,
    };

    if (existing) {
      const updated = await ContactOtpChallenge.findOneAndUpdate(
        {
          _id: existing._id,
          challengeId: existing.challengeId,
          sentAt: existing.sentAt,
        },
        { $set: fields },
        { new: true },
      ).lean();
      if (updated) {
        return {
          challengeId,
          code,
          expiryMinutes: env.OTP_EXPIRY_MINUTES,
        };
      }
      continue;
    }

    try {
      await ContactOtpChallenge.create(fields);
      return {
        challengeId,
        code,
        expiryMinutes: env.OTP_EXPIRY_MINUTES,
      };
    } catch (error) {
      if (hasDuplicateKey(error)) continue;
      throw error;
    }
  }

  throw new Error("The verification challenge could not be issued atomically.");
}

export async function verifyContactOtp(
  challengeId: string,
  code: string,
  now = new Date(),
) {
  const challenge = await ContactOtpChallenge.findOne({
    challengeId,
    expiresAt: { $gt: now },
    verifiedAt: null,
    attempts: { $lt: env.OTP_MAX_ATTEMPTS },
  })
    .select("_id codeHash attempts")
    .lean();
  if (!challenge) return false;

  const candidateHash = Buffer.from(hashCode(code), "hex");
  const expectedHash = Buffer.from(challenge.codeHash, "hex");
  const matches =
    candidateHash.length === expectedHash.length &&
    timingSafeEqual(candidateHash, expectedHash);

  const filter = {
    _id: challenge._id,
    challengeId,
    expiresAt: { $gt: now },
    verifiedAt: null,
    attempts: { $lt: env.OTP_MAX_ATTEMPTS },
  };
  if (!matches) {
    await ContactOtpChallenge.updateOne(filter, { $inc: { attempts: 1 } });
    return false;
  }

  const updated = await ContactOtpChallenge.updateOne(
    { ...filter, codeHash: challenge.codeHash },
    { $set: { verifiedAt: now } },
  );
  return updated.modifiedCount === 1;
}

export async function claimContactOtp(
  challengeId: string,
  email: string,
  now = new Date(),
) {
  const claimed = await ContactOtpChallenge.findOneAndUpdate(
    {
      challengeId,
      email: normalizeEmail(email),
      expiresAt: { $gt: now },
      verifiedAt: { $ne: null },
      $or: [
        { claimedAt: null },
        {
          claimedAt: {
            $lte: new Date(now.getTime() - claimLeaseMilliseconds),
          },
        },
      ],
    },
    { $set: { claimedAt: now } },
    { new: true },
  )
    .select("_id")
    .lean();
  return Boolean(claimed);
}

export async function releaseContactOtp(challengeId: string, email: string) {
  await ContactOtpChallenge.updateOne(
    {
      challengeId,
      email: normalizeEmail(email),
      claimedAt: { $ne: null },
    },
    { $set: { claimedAt: null } },
  );
}

export async function consumeContactOtp(challengeId: string, email: string) {
  await ContactOtpChallenge.deleteOne({
    challengeId,
    email: normalizeEmail(email),
    verifiedAt: { $ne: null },
    claimedAt: { $ne: null },
  });
}

export async function discardContactOtp(challengeId: string) {
  await ContactOtpChallenge.deleteOne({ challengeId });
}
