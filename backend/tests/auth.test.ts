import { compare, hash } from "bcryptjs";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  createUser,
  findUser,
  createSession,
  destroySession,
  getSessionUser,
  databaseConnected,
  pingDatabase,
} = vi.hoisted(() => ({
  createUser: vi.fn(),
  findUser: vi.fn(),
  createSession: vi.fn(),
  destroySession: vi.fn(),
  getSessionUser: vi.fn(),
  databaseConnected: vi.fn(() => true),
  pingDatabase: vi.fn(),
}));

vi.mock("../src/modules/auth/user.model.js", () => ({
  User: { create: createUser, findOne: findUser },
}));

vi.mock("../src/modules/auth/session.model.js", () => ({
  Session: { deleteMany: vi.fn() },
}));

vi.mock("../src/modules/auth/auth-session.js", () => ({
  createSession,
  destroySession,
  getSessionUser,
  hashToken: (token: string) => token,
}));

vi.mock("../src/db/mongoose.js", () => ({
  isDatabaseConnected: databaseConnected,
  pingDatabase,
}));

import { app } from "../src/app.js";

describe("POST /api/v1/auth/register", () => {
  beforeEach(() => {
    createUser.mockReset();
    databaseConnected.mockReturnValue(true);
    pingDatabase.mockReset();
  });

  it("creates a user with a normalized email and a hashed password", async () => {
    const createdAt = new Date("2026-01-01T00:00:00.000Z");
    createUser.mockImplementation(async (data) => ({
      _id: { toString: () => "user_123" },
      fullName: data.fullName,
      email: data.email,
      passwordHash: data.passwordHash,
      createdAt,
    }));

    const response = await request(app).post("/api/v1/auth/register").send({
      fullName: "  Ada Lovelace  ",
      email: " ADA@example.com ",
      phone: "+1 555 123 4567",
      accountType: "individual",
      courseCategory: "IT & Software Development",
      courseName: "AI & the Future of IT Professionals",
      termsAccepted: true,
      password: "correct horse battery",
      confirmPassword: "correct horse battery",
    });

    expect(response.status).toBe(201);
    expect(response.body.data.user).toEqual({
      id: "user_123",
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      createdAt: createdAt.toISOString(),
    });
    const storedPasswordHash = createUser.mock.calls[0][0].passwordHash;
    expect(storedPasswordHash).not.toBe("correct horse battery");
    await expect(
      compare("correct horse battery", storedPasswordHash),
    ).resolves.toBe(true);
    expect(createUser.mock.calls[0][0]).toMatchObject({
      phone: "+1 555 123 4567",
      accountType: "individual",
      courseCategory: "IT & Software Development",
      courseName: "AI & the Future of IT Professionals",
    });
    expect(createUser.mock.calls[0][0]).not.toHaveProperty("role");
  });

  it("rejects invalid registration details without accessing the database", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      fullName: "A",
      email: "not-an-email",
      password: "short",
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(createUser).not.toHaveBeenCalled();
  });

  it("returns a conflict when the email is already registered", async () => {
    createUser.mockRejectedValue({
      code: 11000,
      keyPattern: { email: 1 },
    });

    const response = await request(app).post("/api/v1/auth/register").send({
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      password: "correct horse battery",
      phone: "+1 555 123 4567",
      accountType: "individual",
      courseCategory: "IT & Software Development",
      courseName: "AI & the Future of IT Professionals",
      termsAccepted: true,
      confirmPassword: "correct horse battery",
    });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("EMAIL_ALREADY_REGISTERED");
  });
});

describe("POST /api/v1/auth/login", () => {
  beforeEach(() => {
    findUser.mockReset();
    createSession.mockReset();
  });

  it("rejects unknown accounts without creating a session", async () => {
    findUser.mockResolvedValue(null);

    const response = await request(app).post("/api/v1/auth/login").send({
      email: "missing@example.com",
      password: "correct horse battery",
    });

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("INVALID_CREDENTIALS");
    expect(createSession).not.toHaveBeenCalled();
  });

  it("creates a session for an account with the correct password", async () => {
    findUser.mockResolvedValue({
      _id: { toString: () => "user_123" },
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      accountType: "individual",
      passwordHash: await hash("correct horse battery", 4),
    });

    const response = await request(app).post("/api/v1/auth/login").send({
      email: " ADA@example.com ",
      password: "correct horse battery",
    });

    expect(response.status).toBe(200);
    expect(response.body.data.user).toEqual({
      id: "user_123",
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      accountType: "individual",
      role: "member",
      permissions: [],
    });
    expect(createSession).toHaveBeenCalledWith("user_123", expect.anything());
  });

  it("does not create sessions for deactivated accounts", async () => {
    findUser.mockResolvedValue({
      _id: { toString: () => "user_123" },
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      accountType: "individual",
      isActive: false,
      passwordHash: await hash("correct horse battery", 4),
    });

    const response = await request(app).post("/api/v1/auth/login").send({
      email: "ada@example.com",
      password: "correct horse battery",
    });

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("INVALID_CREDENTIALS");
    expect(createSession).not.toHaveBeenCalled();
  });
});

describe("POST /api/v1/auth/password-reset/request", () => {
  it("requires the website server internal secret", async () => {
    const response = await request(app)
      .post("/api/v1/auth/password-reset/request")
      .send({ email: "ada@example.com" });

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe("FORBIDDEN");
  });

  it("does not reveal whether an email has an account", async () => {
    findUser.mockResolvedValue(null);

    const response = await request(app)
      .post("/api/v1/auth/password-reset/request")
      .set("x-auth-internal-secret", process.env.AUTH_INTERNAL_SECRET!)
      .send({ email: "missing@example.com" });

    expect(response.status).toBe(200);
    expect(response.body.data.token).toBeNull();
  });
});

describe("GET /health/ready", () => {
  it("reports when MongoDB responds to a ping", async () => {
    const response = await request(app).get("/health/ready");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ready");
    expect(pingDatabase).toHaveBeenCalledOnce();
  });

  it("reports when MongoDB is disconnected", async () => {
    databaseConnected.mockReturnValue(false);

    const response = await request(app).get("/health/ready");

    expect(response.status).toBe(503);
    expect(response.body.status).toBe("not-ready");
    expect(pingDatabase).not.toHaveBeenCalled();
  });
});
