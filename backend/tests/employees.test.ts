import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getSessionUser, findUsers, findProjects } = vi.hoisted(() => ({
  getSessionUser: vi.fn(),
  findUsers: vi.fn(),
  findProjects: vi.fn(),
}));

vi.mock("../src/modules/auth/user.model.js", () => ({
  User: {
    find: findUsers,
    findOne: vi.fn(),
    findById: vi.fn(),
  },
}));

vi.mock("../src/modules/auth/session.model.js", () => ({
  Session: { deleteMany: vi.fn() },
}));

vi.mock("../src/modules/auth/auth-session.js", () => ({
  createSession: vi.fn(),
  destroySession: vi.fn(),
  getSessionUser,
  hashToken: (token: string) => token,
}));

vi.mock("../src/modules/employees/employee.model.js", () => ({
  EmployeeProfile: { find: vi.fn(), findOne: vi.fn(), aggregate: vi.fn() },
}));

vi.mock("../src/modules/employees/project.model.js", () => ({
  Project: {
    find: findProjects,
    findById: vi.fn(),
    create: vi.fn(),
    aggregate: vi.fn(),
  },
}));

vi.mock("../src/db/mongoose.js", () => ({
  isDatabaseConnected: vi.fn(() => true),
  pingDatabase: vi.fn(),
}));

import { app } from "../src/app.js";

describe("workforce access", () => {
  beforeEach(() => {
    getSessionUser.mockReset();
    findUsers.mockReset();
    findProjects.mockReset();
  });

  it("allows employees to read only projects they own or are assigned to", async () => {
    const employeeId = "00000000000000000000000a";
    const query = {
      sort: vi.fn(),
      lean: vi.fn().mockResolvedValue([]),
    };
    query.sort.mockReturnValue(query);
    findProjects.mockReturnValue(query);
    getSessionUser.mockResolvedValue({
      id: employeeId,
      fullName: "Team Member",
      email: "member@example.com",
      role: "employee",
      permissions: ["employees:self:read", "projects:self:read"],
    });

    const response = await request(app).get("/api/v1/projects");

    expect(response.status).toBe(200);
    expect(findProjects).toHaveBeenCalledWith({
      $or: [{ ownerId: expect.anything() }, { memberIds: expect.anything() }],
    });
  });

  it("does not allow employees to read the whole employee directory", async () => {
    getSessionUser.mockResolvedValue({
      id: "00000000000000000000000a",
      fullName: "Team Member",
      email: "member@example.com",
      role: "employee",
      permissions: ["employees:self:read"],
    });

    const response = await request(app).get("/api/v1/employees");

    expect(response.status).toBe(403);
    expect(findUsers).not.toHaveBeenCalled();
  });

  it("restricts aggregate workspace reporting to report readers", async () => {
    getSessionUser.mockResolvedValue({
      id: "00000000000000000000000a",
      fullName: "Team Member",
      email: "member@example.com",
      role: "employee",
      permissions: ["employees:self:read"],
    });

    const response = await request(app).get("/api/v1/reports/dashboard");

    expect(response.status).toBe(403);
  });
});
