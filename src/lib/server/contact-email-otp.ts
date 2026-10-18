import {
  createHash,
  randomBytes,
  randomInt,
  timingSafeEqual,
} from "node:crypto";

export interface ContactEmailOtpSettings {
  expiryMilliseconds: number;
  resendCooldownMilliseconds: number;
  maximumAttempts: number;
}

const defaultSettings: ContactEmailOtpSettings = {
  expiryMilliseconds: 10 * 60 * 1000,
  resendCooldownMilliseconds: 60 * 1000,
  maximumAttempts: 5,
};

interface OtpChallenge {
  email: string;
  codeHash: string;
  expiresAt: number;
  attempts: number;
  verified: boolean;
  claimed: boolean;
}

interface OtpStore {
  challenges: Map<string, OtpChallenge>;
  latestChallengeByEmail: Map<string, { challengeId: string; sentAt: number }>;
}

const globalStore = globalThis as typeof globalThis & {
  __praedicoaiContactEmailOtpStore?: OtpStore;
};
const store = (globalStore.__praedicoaiContactEmailOtpStore ??= {
  challenges: new Map<string, OtpChallenge>(),
  latestChallengeByEmail: new Map<
    string,
    { challengeId: string; sentAt: number }
  >(),
});
const { challenges, latestChallengeByEmail } = store;

function readPositiveInteger(name: string, fallback: number) {
  const value = process.env[name]?.trim();
  if (value === undefined || value === "") return fallback;
  if (!/^\d+$/.test(value)) {
    throw new Error(`${name} must be a positive whole number.`);
  }

  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new Error(`${name} must be a positive safe integer.`);
  }
  return parsed;
}

function readPositiveDuration(
  name: string,
  fallback: number,
  millisecondsPerUnit: number,
) {
  const duration =
    readPositiveInteger(name, fallback / millisecondsPerUnit) *
    millisecondsPerUnit;
  if (!Number.isSafeInteger(duration)) {
    throw new Error(`${name} is too large.`);
  }
  return duration;
}

export function getContactEmailOtpSettings(): ContactEmailOtpSettings {
  return {
    expiryMilliseconds: readPositiveDuration(
      "OTP_EXPIRY_MINUTES",
      defaultSettings.expiryMilliseconds,
      60_000,
    ),
    maximumAttempts: readPositiveInteger(
      "OTP_MAX_ATTEMPTS",
      defaultSettings.maximumAttempts,
    ),
    resendCooldownMilliseconds: readPositiveDuration(
      "OTP_RESEND_COOLDOWN_SECONDS",
      defaultSettings.resendCooldownMilliseconds,
      1000,
    ),
  };
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function removeChallenge(challengeId: string) {
  const challenge = challenges.get(challengeId);
  challenges.delete(challengeId);
  if (
    challenge &&
    latestChallengeByEmail.get(challenge.email)?.challengeId === challengeId
  ) {
    latestChallengeByEmail.delete(challenge.email);
  }
}

function pruneExpired(now: number) {
  for (const [challengeId, challenge] of challenges) {
    if (challenge.expiresAt <= now) removeChallenge(challengeId);
  }
}

export function createContactEmailOtp(
  email: string,
  settings: ContactEmailOtpSettings,
  now = Date.now(),
) {
  pruneExpired(now);
  const normalizedEmail = normalizeEmail(email);
  const latest = latestChallengeByEmail.get(normalizedEmail);

  if (latest && latest.sentAt + settings.resendCooldownMilliseconds > now) {
    return {
      retryAfterSeconds: Math.ceil(
        (latest.sentAt + settings.resendCooldownMilliseconds - now) / 1000,
      ),
    };
  }
  if (latest) removeChallenge(latest.challengeId);

  const challengeId = randomBytes(32).toString("hex");
  const code = randomInt(100_000, 1_000_000).toString();
  challenges.set(challengeId, {
    email: normalizedEmail,
    codeHash: createHash("sha256").update(code).digest("hex"),
    expiresAt: now + settings.expiryMilliseconds,
    attempts: 0,
    verified: false,
    claimed: false,
  });
  latestChallengeByEmail.set(normalizedEmail, {
    challengeId,
    sentAt: now,
  });

  return { challengeId, code };
}

export function discardContactEmailOtp(challengeId: string) {
  removeChallenge(challengeId);
}

export function verifyContactEmailOtp(
  challengeId: string,
  code: string,
  settings: ContactEmailOtpSettings,
  now = Date.now(),
) {
  pruneExpired(now);
  const challenge = challenges.get(challengeId);
  if (
    !challenge ||
    challenge.expiresAt <= now ||
    challenge.attempts >= settings.maximumAttempts
  ) {
    removeChallenge(challengeId);
    return false;
  }

  const candidateHash = createHash("sha256").update(code).digest();
  const expectedHash = Buffer.from(challenge.codeHash, "hex");
  if (!timingSafeEqual(candidateHash, expectedHash)) {
    challenge.attempts += 1;
    if (challenge.attempts >= settings.maximumAttempts)
      removeChallenge(challengeId);
    return false;
  }

  challenge.verified = true;
  return true;
}

export function claimContactEmailVerification(
  challengeId: string,
  email: string,
  now = Date.now(),
) {
  pruneExpired(now);
  const challenge = challenges.get(challengeId);
  if (
    !challenge ||
    challenge.expiresAt <= now ||
    !challenge.verified ||
    challenge.claimed ||
    challenge.email !== normalizeEmail(email)
  ) {
    return false;
  }

  challenge.claimed = true;
  return true;
}

export function releaseContactEmailVerification(challengeId: string) {
  const challenge = challenges.get(challengeId);
  if (challenge) challenge.claimed = false;
}

export function consumeContactEmailVerification(challengeId: string) {
  removeChallenge(challengeId);
}
