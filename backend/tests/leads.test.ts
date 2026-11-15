import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  createLeadRecord,
  findLeads,
  countLeads,
  aggregateLeads,
  findLeadById,
  getSessionUser,
  findTeamMember,
} = vi.hoisted(() => ({
  createLeadRecord: vi.fn(),
  findLeads: vi.fn(),
  countLeads: vi.fn(),
  aggregateLeads: vi.fn(),
  findLeadById: vi.fn(),
  getSessionUser: vi.fn(),
  findTeamMember: vi.fn(),
}));

vi.mock("../src/modules/leads/lead.model.js", () => ({
  Lead: {
    create: createLeadRecord,
    find: findLeads,
    countDocuments: countLeads,
    aggregate: aggregateLeads,
    findById: findLeadById,
  },
}));

vi.mock("../src/modules/auth/user.model.js", () => ({
  User: {
    findOne: findTeamMember,
  },
}));

vi.mock("../src/modules/auth/auth-session.js", () => ({
  createSession: vi.fn(),
  destroySession: vi.fn(),
  getSessionUser,
  hashToken: (token: string) => token,
}));

vi.mock("../src/db/mongoose.js", () => ({
  isDatabaseConnected: vi.fn(() => true),
  pingDatabase: vi.fn(),
}));

import { app } from "../src/app.js";

const internalSecret = process.env.AUTH_INTERNAL_SECRET!;
const admin = {
  id: "admin-id",
  fullName: "Praedico Admin",
  email: "admin@example.com",
  accountType: "business",
  role: "admin",
};

function businessSubmission(overrides: Record<string, unknown> = {}) {
  return {
    category: "AI Consulting",
    name: "Ada Lovelace",
    company: "Analytical Engines",
    designation: "Director",
    email: "ADA@example.com",
    phone: "+1 555 123 4567",
    industry: "Technology",
    businessProblem: "Review a repetitive workflow.",
    requiredAISolution: "Explore workflow automation.",
    budgetRange: "",
    preferredContactMethod: "email",
    consent: true,
    ...overrides,
  };
}

describe("POST /api/v1/leads", () => {
  beforeEach(() => {
    createLeadRecord.mockReset();
    getSessionUser.mockReset().mockResolvedValue(null);
    createLeadRecord.mockImplementation(async (lead) => ({
      _id: { toString: () => "lead-123" },
      category: lead.category,
      ...lead,
    }));
  });

  it("rejects submissions without the internal server secret", async () => {
    const response = await request(app)
      .post("/api/v1/leads")
      .send(businessSubmission());

    expect(response.status).toBe(403);
    expect(createLeadRecord).not.toHaveBeenCalled();
  });

  it("validates the form and derives the business vertical on the server", async () => {
    const response = await request(app)
      .post("/api/v1/leads")
      .set("x-auth-internal-secret", internalSecret)
      .send(businessSubmission());

    expect(response.status).toBe(201);
    expect(response.body.data).toEqual({
      id: "lead-123",
      category: "AI Consulting",
    });
    expect(createLeadRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        category: "AI Consulting",
        email: "ada@example.com",
      }),
    );
    expect(createLeadRecord.mock.calls[0][0]).toMatchObject({
      vertical: "AI Business Solutions",
      recordType: "business",
      status: "New",
    });
    expect(createLeadRecord.mock.calls[0][0]).not.toHaveProperty("consent");
    expect(createLeadRecord.mock.calls[0][0]).not.toHaveProperty("website");
  });

  it("rejects incomplete forms and honeypot submissions", async () => {
    const invalid = await request(app)
      .post("/api/v1/leads")
      .set("x-auth-internal-secret", internalSecret)
      .send({ ...businessSubmission(), company: "" });
    const spam = await request(app)
      .post("/api/v1/leads")
      .set("x-auth-internal-secret", internalSecret)
      .send(businessSubmission({ website: "https://spam.example" }));

    expect(invalid.status).toBe(400);
    expect(invalid.body.error.code).toBe("VALIDATION_ERROR");
    expect(spam.status).toBe(400);
    expect(spam.body.error.code).toBe("SPAM_DETECTED");
    expect(createLeadRecord).not.toHaveBeenCalled();
  });

  it.each([
    ["AI Product Interest", "AI Business Solutions", "business"],
    ["AI Community", "AI Learning", "registration"],
    ["AI Research Interest", "AI Learning", "registration"],
  ] as const)(
    "accepts %s interest and classifies it under %s",
    async (category, vertical, recordType) => {
      const response = await request(app)
        .post("/api/v1/leads")
        .set("x-auth-internal-secret", internalSecret)
        .send({
          category,
          name: "Alex Example",
          company: "Example Organization",
          email: "alex@example.com",
          phone: "+1 555 123 4567",
          interestArea: "A possible AI concept",
          learningObjectives: "Discuss intended users and next steps.",
          consent: true,
        });

      expect(response.status).toBe(201);
      expect(createLeadRecord).toHaveBeenCalledWith(
        expect.objectContaining({ category, vertical, recordType }),
      );
    },
  );
});

describe("GET /api/v1/leads/admin", () => {
  beforeEach(() => {
    getSessionUser.mockReset().mockResolvedValue(null);
    findLeads.mockReset();
    countLeads.mockReset().mockResolvedValue(0);
    const query = {
      sort: vi.fn(),
      skip: vi.fn(),
      limit: vi.fn(),
      lean: vi.fn().mockResolvedValue([]),
    };
    query.sort.mockReturnValue(query);
    query.skip.mockReturnValue(query);
    query.limit.mockReturnValue(query);
    findLeads.mockReturnValue(query);
  });

  it("requires an admin session and rejects regular accounts", async () => {
    const anonymous = await request(app).get("/api/v1/leads/admin");
    getSessionUser.mockResolvedValue({
      ...admin,
      role: "member",
    });
    const member = await request(app).get("/api/v1/leads/admin");

    expect(anonymous.status).toBe(401);
    expect(member.status).toBe(403);
    expect(findLeads).not.toHaveBeenCalled();
  });

  it("returns filtered, paginated leads to admins", async () => {
    getSessionUser.mockResolvedValue(admin);

    const response = await request(app)
      .get(
        "/api/v1/leads/admin?vertical=AI%20Business%20Solutions&status=New&page=2&limit=10",
      )
      .set("Cookie", "praedicoai_session=valid-session");

    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({
      total: 0,
      page: 2,
      limit: 10,
    });
    expect(findLeads).toHaveBeenCalledWith({
      vertical: "AI Business Solutions",
      status: "New",
    });
  });

  it("limits training managers to AI Learning enquiries", async () => {
    getSessionUser.mockResolvedValue({
      ...admin,
      role: "training_manager",
    });

    const response = await request(app).get("/api/v1/leads/admin");

    expect(response.status).toBe(200);
    expect(findLeads).toHaveBeenCalledWith({ vertical: "AI Learning" });
  });
});

describe("PATCH /api/v1/leads/admin/:id", () => {
  beforeEach(() => {
    getSessionUser.mockReset().mockResolvedValue(admin);
    findLeadById.mockReset();
    findTeamMember.mockReset();
  });

  it("records status, an authorized assignee, follow-up, and note", async () => {
    const lead = {
      _id: { toString: () => "0123456789abcdef01234567" },
      category: "AI Consulting",
      status: "New",
      statusHistory: [{ status: "New", changedBy: "system" }],
      notes: [],
      save: vi.fn().mockResolvedValue(undefined),
    };
    const assigneeQuery = {
      select: vi.fn(),
      lean: vi.fn().mockResolvedValue({
        fullName: "Sam Teammate",
        email: "sam@example.com",
      }),
    };
    assigneeQuery.select.mockReturnValue(assigneeQuery);
    findLeadById.mockResolvedValue(lead);
    findTeamMember.mockReturnValue(assigneeQuery);

    const response = await request(app)
      .patch("/api/v1/leads/admin/0123456789abcdef01234567")
      .send({
        status: "Contacted",
        assignee: { name: "Spoofed Name", email: "SAM@example.com" },
        followUpAt: "2026-10-25T10:30:00.000Z",
        note: "Discussed initial requirements.",
      });

    expect(response.status).toBe(200);
    expect(lead.status).toBe("Contacted");
    expect(lead.statusHistory).toHaveLength(2);
    expect(lead.statusHistory[1]).toMatchObject({
      status: "Contacted",
      changedBy: "admin@example.com",
    });
    expect(lead.assignee).toEqual({
      name: "Sam Teammate",
      email: "sam@example.com",
    });
    expect(lead.followUpAt).toEqual(new Date("2026-10-25T10:30:00.000Z"));
    expect(lead.notes[0]).toMatchObject({
      text: "Discussed initial requirements.",
      authorEmail: "admin@example.com",
    });
    expect(lead.save).toHaveBeenCalledOnce();
  });
});
