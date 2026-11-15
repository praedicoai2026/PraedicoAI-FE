import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  env: {
    NODE_ENV: "test",
    PORT: 4000,
    LOG_LEVEL: "silent",
    FRONTEND_ORIGIN: "http://localhost:3000",
    FRONTEND_ORIGINS: ["https://praedicoai.com", "http://localhost:3000"],
    DB_USER: "test",
    DB_PASSWORD: "test",
    MONGODB_URI: "mongodb://localhost/praedicoai-test",
    AUTH_INTERNAL_SECRET: "test-internal-secret-with-at-least-32-characters",
    GEMINI_API_KEY: "test-gemini-key",
    GEMINI_MODEL: "gemini-test-model",
    GEMINI_DEMO_RELEASE_STATUS: "beta",
    DEMO_MAX_INPUT_CHARACTERS: 2000,
    DEMO_MAX_OUTPUT_TOKENS: 600,
  },
  createDemoUsage: vi.fn(),
  aggregateDemoUsage: vi.fn(),
  geminiFetch: vi.fn(),
  getSessionUser: vi.fn(),
  aggregateLeads: vi.fn(),
  findLead: vi.fn(),
  createLead: vi.fn(),
  findUser: vi.fn(),
}));

vi.mock("../src/config/env.js", () => ({ env: mocks.env }));
vi.mock("../src/modules/demos/demo.model.js", () => ({
  DemoUsage: {
    create: mocks.createDemoUsage,
    aggregate: mocks.aggregateDemoUsage,
  },
}));
vi.mock("../src/modules/leads/lead.model.js", () => ({
  Lead: {
    create: mocks.createLead,
    find: mocks.findLead,
    countDocuments: vi.fn(),
    aggregate: mocks.aggregateLeads,
    findById: vi.fn(),
  },
}));
vi.mock("../src/modules/auth/user.model.js", () => ({
  User: {
    findOne: mocks.findUser,
  },
}));
vi.mock("../src/modules/auth/auth-session.js", () => ({
  createSession: vi.fn(),
  destroySession: vi.fn(),
  getSessionUser: mocks.getSessionUser,
  hashToken: (token: string) => token,
}));
vi.mock("../src/db/mongoose.js", () => ({
  isDatabaseConnected: vi.fn(() => true),
  pingDatabase: vi.fn(),
}));

import { app } from "../src/app.js";
import { getDemoAnalytics } from "../src/modules/demos/demo.service.js";

const internalSecret = mocks.env.AUTH_INTERNAL_SECRET;
const validDemoRequest = {
  slug: "sales-email-generator",
  category: "AI Solutions",
  input: "Draft a fictional follow-up after an introductory meeting.",
  ageConfirmed: true,
  dataPolicyAccepted: true,
  countryCode: "US",
  rateLimitKey: "a".repeat(64),
};

describe("demo API", () => {
  beforeEach(() => {
    mocks.env.GEMINI_API_KEY = "test-gemini-key";
    mocks.env.GEMINI_DEMO_RELEASE_STATUS = "beta";
    mocks.createDemoUsage.mockReset().mockResolvedValue(undefined);
    mocks.aggregateDemoUsage.mockReset().mockResolvedValue([]);
    mocks.aggregateLeads.mockReset().mockResolvedValue([]);
    mocks.geminiFetch.mockReset().mockResolvedValue(
      new Response(
        JSON.stringify({
          candidates: [
            {
              content: {
                parts: [{ text: "Subject: Follow-up\n\nHello there." }],
              },
            },
          ],
          usageMetadata: {
            promptTokenCount: 18,
            candidatesTokenCount: 10,
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", mocks.geminiFetch);
    mocks.getSessionUser.mockReset().mockResolvedValue(null);
  });

  it("reports a configured demo only in an eligible region", async () => {
    const available = await request(app)
      .get("/api/v1/demos/status")
      .set("x-vercel-ip-country", "US");
    const restricted = await request(app)
      .get("/api/v1/demos/status")
      .set("x-vercel-ip-country", "GB");
    const unknown = await request(app).get("/api/v1/demos/status");

    expect(available.body.data).toMatchObject({
      available: true,
      status: "Beta Demo",
    });
    expect(restricted.body.data).toMatchObject({
      available: false,
      status: "Coming Soon",
      regionAllowed: false,
    });
    expect(unknown.body.data).toMatchObject({
      available: false,
      reason: "region-unknown",
    });
  });

  it("requires the internal server secret and age/data confirmations", async () => {
    const unauthorized = await request(app)
      .post("/api/v1/demos/execute")
      .send(validDemoRequest);
    const unconfirmed = await request(app)
      .post("/api/v1/demos/execute")
      .set("x-auth-internal-secret", internalSecret)
      .send({ ...validDemoRequest, ageConfirmed: false });

    expect(unauthorized.status).toBe(403);
    expect(unconfirmed.status).toBe(400);
    expect(mocks.geminiFetch).not.toHaveBeenCalled();
  });

  it("generates a draft without persisting user text or exposing the API key", async () => {
    const response = await request(app)
      .post("/api/v1/demos/execute")
      .set("x-auth-internal-secret", internalSecret)
      .send(validDemoRequest);

    expect(response.status).toBe(200);
    expect(response.body.data.output).toContain("Subject: Follow-up");
    expect(mocks.geminiFetch).toHaveBeenCalledWith(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-test-model:generateContent",
      expect.objectContaining({
        headers: expect.objectContaining({
          "x-goog-api-key": "test-gemini-key",
        }),
      }),
    );
    expect(mocks.createDemoUsage).toHaveBeenCalledTimes(2);
    expect(JSON.stringify(mocks.createDemoUsage.mock.calls)).not.toContain(
      validDemoRequest.input,
    );
  });

  it("rejects restricted regions and oversized prompts before calling Gemini", async () => {
    const restricted = await request(app)
      .post("/api/v1/demos/execute")
      .set("x-auth-internal-secret", internalSecret)
      .send({ ...validDemoRequest, countryCode: "GB" });
    const oversized = await request(app)
      .post("/api/v1/demos/execute")
      .set("x-auth-internal-secret", internalSecret)
      .send({ ...validDemoRequest, input: "x".repeat(2001) });

    expect(restricted.status).toBe(403);
    expect(oversized.status).toBe(400);
    expect(mocks.geminiFetch).not.toHaveBeenCalled();
  });

  it("protects demo analytics with an admin session", async () => {
    const response = await request(app).get("/api/v1/demos/admin/analytics");

    expect(response.status).toBe(401);
    expect(mocks.aggregateDemoUsage).not.toHaveBeenCalled();
  });

  it("attributes submitted demo enquiries without exposing lead details", async () => {
    mocks.aggregateDemoUsage
      .mockResolvedValueOnce([
        { views: 10, launches: 4, successes: 3, failures: 1 },
      ])
      .mockResolvedValueOnce([
        {
          _id: { slug: "sales-email-generator", category: "AI Solutions" },
          views: 10,
          launches: 4,
          successes: 3,
          failures: 1,
        },
      ])
      .mockResolvedValueOnce([]);
    mocks.aggregateLeads.mockResolvedValue([
      { _id: "/demos/sales-email-generator", count: 2 },
      { _id: "/demos", count: 1 },
    ]);

    const analytics = await getDemoAnalytics();

    expect(analytics.totals.enquiryConversions).toBe(3);
    expect(analytics.byDemo[0]).toMatchObject({
      _id: { slug: "sales-email-generator" },
      enquiryConversions: 2,
    });
    expect(mocks.aggregateLeads).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          $group: { _id: "$sourcePath", count: { $sum: 1 } },
        }),
      ]),
    );
  });
});
