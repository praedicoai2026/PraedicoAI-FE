import { createHmac } from "node:crypto";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  createChallenge,
  deleteChallenge,
  findChallenge,
  findAndUpdateChallenge,
  updateChallenge,
} = vi.hoisted(() => ({
  createChallenge: vi.fn(),
  deleteChallenge: vi.fn(),
  findChallenge: vi.fn(),
  findAndUpdateChallenge: vi.fn(),
  updateChallenge: vi.fn(),
}));

vi.mock("../src/modules/contact-otp/contact-otp.model.js", () => ({
  ContactOtpChallenge: {
    create: createChallenge,
    deleteOne: deleteChallenge,
    findOne: findChallenge,
    findOneAndUpdate: findAndUpdateChallenge,
    updateOne: updateChallenge,
  },
}));

import { app } from "../src/app.js";
import {
  claimContactOtp,
  consumeContactOtp,
  createContactOtp,
  releaseContactOtp,
  verifyContactOtp,
} from "../src/modules/contact-otp/contact-otp.service.js";

const internalSecret = process.env.AUTH_INTERNAL_SECRET!;

function queryResult(value: unknown) {
  const query = {
    lean: vi.fn(),
    select: vi.fn(),
  };
  query.lean.mockResolvedValue(value);
  query.select.mockReturnValue(query);
  return query;
}

describe("contact email verification", () => {
  beforeEach(() => {
    createChallenge.mockReset();
    deleteChallenge.mockReset();
    findChallenge.mockReset();
    findAndUpdateChallenge.mockReset();
    updateChallenge.mockReset();
  });

  it("protects the internal OTP endpoint", async () => {
    const response = await request(app)
      .post("/api/v1/contact-otp")
      .send({ action: "request", email: "person@example.com" });

    expect(response.status).toBe(403);
    expect(createChallenge).not.toHaveBeenCalled();
  });

  it("creates challenges only for authorized internal requests", async () => {
    findChallenge.mockReturnValue(queryResult(null));
    createChallenge.mockResolvedValue(undefined);

    const response = await request(app)
      .post("/api/v1/contact-otp")
      .set("x-auth-internal-secret", internalSecret)
      .send({ action: "request", email: "person@example.com" });

    expect(response.status).toBe(201);
    expect(response.body.data).toMatchObject({
      challengeId: expect.stringMatching(/^[a-f0-9]{64}$/),
      code: expect.stringMatching(/^\d{6}$/),
      expiryMinutes: 10,
    });
  });

  it("stores a peppered code hash and normalizes the email", async () => {
    findChallenge.mockReturnValue(queryResult(null));
    createChallenge.mockResolvedValue(undefined);
    const now = new Date("2026-01-01T00:00:00.000Z");

    const result = await createContactOtp(" Person@Example.com ", now);
    const stored = createChallenge.mock.calls[0][0];
    const expectedHash = createHmac("sha256", process.env.AUTH_INTERNAL_SECRET!)
      .update(result.code)
      .digest("hex");

    expect(result).toMatchObject({ expiryMinutes: 10 });
    expect(result.challengeId).toMatch(/^[a-f0-9]{64}$/);
    expect(result.code).toMatch(/^\d{6}$/);
    expect(stored).toMatchObject({
      email: "person@example.com",
      challengeId: result.challengeId,
      codeHash: expectedHash,
      expiresAt: new Date("2026-01-01T00:10:00.000Z"),
      sentAt: now,
      attempts: 0,
      verifiedAt: null,
      claimedAt: null,
    });
    expect(stored).not.toHaveProperty("code");
  });

  it("enforces the resend cooldown without issuing another code", async () => {
    const now = new Date("2026-01-01T00:00:30.000Z");
    findChallenge.mockReturnValue(
      queryResult({
        _id: "challenge-db-id",
        challengeId: "a".repeat(64),
        sentAt: new Date("2026-01-01T00:00:00.000Z"),
      }),
    );

    await expect(createContactOtp("person@example.com", now)).resolves.toEqual({
      retryAfterSeconds: 30,
    });
    expect(createChallenge).not.toHaveBeenCalled();
    expect(findAndUpdateChallenge).not.toHaveBeenCalled();
  });

  it("verifies a matching code only once", async () => {
    const code = "123456";
    const codeHash = createHmac("sha256", process.env.AUTH_INTERNAL_SECRET!)
      .update(code)
      .digest("hex");
    findChallenge.mockReturnValue(
      queryResult({ _id: "challenge-db-id", codeHash, attempts: 0 }),
    );
    updateChallenge.mockResolvedValue({ modifiedCount: 1 });
    const now = new Date("2026-01-01T00:01:00.000Z");

    await expect(verifyContactOtp("a".repeat(64), code, now)).resolves.toBe(
      true,
    );
    expect(updateChallenge).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: "challenge-db-id",
        challengeId: "a".repeat(64),
        verifiedAt: null,
      }),
      { $set: { verifiedAt: now } },
    );
  });

  it("increments attempts for an incorrect code", async () => {
    findChallenge.mockReturnValue(
      queryResult({
        _id: "challenge-db-id",
        codeHash: "0".repeat(64),
        attempts: 0,
      }),
    );
    updateChallenge.mockResolvedValue({ modifiedCount: 1 });

    await expect(verifyContactOtp("a".repeat(64), "123456")).resolves.toBe(
      false,
    );
    expect(updateChallenge).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: "challenge-db-id",
        attempts: { $lt: 5 },
      }),
      { $inc: { attempts: 1 } },
    );
  });

  it("atomically claims, releases, and consumes a verified challenge", async () => {
    findAndUpdateChallenge.mockReturnValue(
      queryResult({ _id: "challenge-db-id" }),
    );
    await expect(
      claimContactOtp("a".repeat(64), "Person@Example.com"),
    ).resolves.toBe(true);
    expect(findAndUpdateChallenge).toHaveBeenCalledWith(
      expect.objectContaining({
        challengeId: "a".repeat(64),
        email: "person@example.com",
        verifiedAt: { $ne: null },
        expiresAt: expect.objectContaining({ $gt: expect.any(Date) }),
      }),
      { $set: { claimedAt: expect.any(Date) } },
      { new: true },
    );

    await releaseContactOtp("a".repeat(64), "Person@Example.com");
    expect(updateChallenge).toHaveBeenCalledWith(
      {
        challengeId: "a".repeat(64),
        email: "person@example.com",
        claimedAt: { $ne: null },
      },
      { $set: { claimedAt: null } },
    );

    await consumeContactOtp("a".repeat(64), "Person@Example.com");
    expect(deleteChallenge).toHaveBeenCalledWith({
      challengeId: "a".repeat(64),
      email: "person@example.com",
      verifiedAt: { $ne: null },
      claimedAt: { $ne: null },
    });
  });
});
