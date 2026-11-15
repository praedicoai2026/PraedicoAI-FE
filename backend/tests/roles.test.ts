import { describe, expect, it } from "vitest";
import {
  getEffectivePermissions,
  hasPermission,
} from "../src/modules/auth/roles.js";
import { adminAccountUpdateSchema } from "../src/modules/admin/admin.schema.js";

describe("admin role permissions", () => {
  it("keeps administrator management restricted to Super Admin", () => {
    expect(
      hasPermission(
        {
          role: "admin",
          permissions: ["admins:manage", "settings:manage"],
        },
        "admins:manage",
      ),
    ).toBe(false);
    expect(
      hasPermission(
        {
          role: "admin",
          permissions: ["settings:manage"],
        },
        "settings:manage",
      ),
    ).toBe(false);
  });

  it("uses configured permissions while Super Admin retains all permissions", () => {
    expect(
      getEffectivePermissions("training_manager", ["leads:read"]),
    ).toEqual(["leads:read"]);
    expect(getEffectivePermissions("super_admin", [])).toContain(
      "admins:manage",
    );
  });

  it("rejects Super Admin-only permissions in account updates", () => {
    expect(
      adminAccountUpdateSchema.safeParse({
        permissions: ["admins:manage"],
      }).success,
    ).toBe(false);
    expect(
      adminAccountUpdateSchema.safeParse({
        permissions: ["settings:manage"],
      }).success,
    ).toBe(false);
  });

  it("allows Content Managers to prepare review drafts but not publish", () => {
    expect(
      hasPermission(
        { role: "content_manager" },
        "content:manage",
      ),
    ).toBe(true);
    expect(
      hasPermission(
        { role: "content_manager" },
        "content:publish",
      ),
    ).toBe(false);
  });
});
