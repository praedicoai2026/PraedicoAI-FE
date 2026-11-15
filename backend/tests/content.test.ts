import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HttpError } from "../src/errors/http-error.js";

const {
  getSessionUser,
  createContent,
  getPublishedContent,
  updateContent,
} = vi.hoisted(() => ({
    getSessionUser: vi.fn(),
    createContent: vi.fn(),
    getPublishedContent: vi.fn(),
    updateContent: vi.fn(),
  }));

vi.mock("../src/modules/auth/auth-session.js", () => ({
  createSession: vi.fn(),
  destroySession: vi.fn(),
  getSessionUser,
  hashToken: (token: string) => token,
}));

vi.mock("../src/modules/auth/user.model.js", () => ({
  User: {
    create: vi.fn(),
    findOne: vi.fn(),
  },
}));

vi.mock("../src/modules/auth/session.model.js", () => ({
  Session: { deleteMany: vi.fn() },
}));

vi.mock("../src/modules/content/content.service.js", () => ({
  createContent,
  getPublishedContent,
  listManagedContent: vi.fn(),
  updateContent,
}));

vi.mock("../src/db/mongoose.js", () => ({
  isDatabaseConnected: vi.fn(() => true),
  pingDatabase: vi.fn(),
}));

import { app } from "../src/app.js";

const contentManager = {
  id: "000000000000000000000001",
  fullName: "Content Editor",
  email: "editor@example.com",
  accountType: "individual",
  role: "content_manager",
  permissions: ["content:read", "content:manage"],
};

const draft = {
  type: "article",
  slug: "responsible-ai",
  title: "Responsible AI",
  summary: "A practical overview of responsible AI design.",
  body: "This content explains review, privacy, and human oversight.",
  seoTitle: "Responsible AI Guide",
  seoDescription: "Learn practical approaches to responsible AI design.",
};

describe("content publishing workflow", () => {
  beforeEach(() => {
    getSessionUser.mockReset().mockResolvedValue(contentManager);
    createContent.mockReset().mockResolvedValue({ ...draft, status: "draft" });
    getPublishedContent.mockReset().mockResolvedValue(null);
    updateContent.mockReset().mockResolvedValue({ ...draft, status: "archived" });
  });

  it("allows editors to create and submit drafts but prevents them from publishing", async () => {
    const savedDraft = await request(app)
      .post("/api/v1/content/admin")
      .send(draft);
    const submitted = await request(app)
      .post("/api/v1/content/admin")
      .send({ ...draft, slug: "review-request", status: "review" });
    const publishAttempt = await request(app)
      .post("/api/v1/content/admin")
      .send({ ...draft, slug: "publish-attempt", status: "published" });

    expect(savedDraft.status).toBe(201);
    expect(submitted.status).toBe(201);
    expect(publishAttempt.status).toBe(403);
    expect(createContent).toHaveBeenCalledTimes(2);
  });

  it("allows authorized reviewers to publish and archive entries", async () => {
    getSessionUser.mockResolvedValue({
      ...contentManager,
      role: "admin",
      permissions: ["content:read", "content:manage", "content:publish"],
    });

    const published = await request(app)
      .post("/api/v1/content/admin")
      .send({ ...draft, slug: "published-guide", status: "published" });
    const archived = await request(app)
      .patch("/api/v1/content/admin/000000000000000000000002")
      .send({ status: "archived" });

    expect(published.status).toBe(201);
    expect(archived.status).toBe(200);
    expect(updateContent).toHaveBeenCalledWith(
      "000000000000000000000002",
      { status: "archived" },
      contentManager.id,
    );
  });

  it("returns a clear conflict when a content slug is already in use", async () => {
    createContent.mockRejectedValueOnce(
      new HttpError(
        409,
        "CONTENT_SLUG_TAKEN",
        "A content entry already uses this URL slug.",
      ),
    );

    const response = await request(app)
      .post("/api/v1/content/admin")
      .send(draft);

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("CONTENT_SLUG_TAKEN");
  });

  it("does not expose draft or review content through the public endpoint", async () => {
    const response = await request(app).get(
      "/api/v1/content/public/responsible-ai",
    );

    expect(response.status).toBe(404);
    expect(getPublishedContent).toHaveBeenCalledWith("responsible-ai");
  });
});
