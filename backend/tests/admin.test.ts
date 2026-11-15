import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  getSessionUser,
  findUsers,
  countUsers,
  findUserById,
  deleteSessions,
  createAudit,
} = vi.hoisted(() => ({
  getSessionUser: vi.fn(),
  findUsers: vi.fn(),
  countUsers: vi.fn(),
  findUserById: vi.fn(),
  deleteSessions: vi.fn(),
  createAudit: vi.fn(),
}));

vi.mock("../src/modules/auth/user.model.js", () => ({
  User: {
    find: findUsers,
    countDocuments: countUsers,
    findById: findUserById,
  },
}));

vi.mock("../src/modules/auth/session.model.js", () => ({
  Session: { deleteMany: deleteSessions },
}));

vi.mock("../src/modules/auth/auth-session.js", () => ({
  createSession: vi.fn(),
  destroySession: vi.fn(),
  getSessionUser,
  hashToken: (token: string) => token,
}));

vi.mock("../src/modules/admin/admin-audit.model.js", () => ({
  AdminAudit: { create: createAudit },
}));

vi.mock("../src/db/mongoose.js", () => ({
  isDatabaseConnected: vi.fn(() => true),
  pingDatabase: vi.fn(),
}));

import { app } from "../src/app.js";

const superAdmin = {
  id: "000000000000000000000001",
  fullName: "Praedico Super Admin",
  email: "owner@example.com",
  accountType: "business",
  role: "super_admin",
  permissions: ["admins:manage"],
};

describe("/api/v1/admin/accounts", () => {
  beforeEach(() => {
    getSessionUser.mockReset().mockResolvedValue(null);
    findUsers.mockReset();
    countUsers.mockReset();
    findUserById.mockReset();
    deleteSessions.mockReset().mockResolvedValue({ deletedCount: 1 });
    createAudit.mockReset().mockResolvedValue({});
  });

  it("denies account management to non-Super Admin users", async () => {
    getSessionUser.mockResolvedValue({
      ...superAdmin,
      role: "admin",
      permissions: ["leads:read"],
    });

    const response = await request(app).get("/api/v1/admin/accounts");

    expect(response.status).toBe(403);
    expect(findUsers).not.toHaveBeenCalled();
  });

  it("revokes sessions and audits permission changes when deactivating an account", async () => {
    const targetId = "000000000000000000000002";
    const target = {
      _id: { toString: () => targetId },
      fullName: "Team Admin",
      email: "admin@example.com",
      role: "admin",
      permissions: null,
      isActive: true,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-02T00:00:00.000Z"),
      save: vi.fn().mockResolvedValue(undefined),
    };
    const query = { select: vi.fn().mockResolvedValue(target) };
    findUserById.mockReturnValue(query);
    getSessionUser.mockResolvedValue(superAdmin);

    const response = await request(app)
      .patch(`/api/v1/admin/accounts/${targetId}`)
      .send({ isActive: false, permissions: ["leads:read"] });

    expect(response.status).toBe(200);
    expect(target.save).toHaveBeenCalledOnce();
    expect(deleteSessions).toHaveBeenCalledWith({ userId: target._id });
    expect(createAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        targetEmail: "admin@example.com",
        beforeActive: true,
        afterActive: false,
        permissionsChanged: true,
        afterPermissions: ["leads:read"],
      }),
    );
    expect(response.body.data.account).toMatchObject({
      id: targetId,
      role: "admin",
      isActive: false,
      permissions: ["leads:read"],
    });
  });
});
