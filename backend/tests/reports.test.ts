import { beforeEach, describe, expect, it, vi } from "vitest";

const { aggregateLeads, getDemoAnalytics, getEmployeeReport } = vi.hoisted(
  () => ({
    aggregateLeads: vi.fn(),
    getDemoAnalytics: vi.fn(),
    getEmployeeReport: vi.fn(),
  }),
);

vi.mock("../src/modules/leads/lead.model.js", () => ({
  Lead: { aggregate: aggregateLeads },
}));

vi.mock("../src/modules/demos/demo.service.js", () => ({
  getDemoAnalytics,
}));

vi.mock("../src/modules/employees/employee.service.js", () => ({
  getEmployeeReport,
}));

import { getDashboardAnalytics } from "../src/modules/reports/dashboard.service.js";

describe("unified dashboard analytics", () => {
  beforeEach(() => {
    aggregateLeads.mockReset().mockResolvedValue([
      {
        totalsByVertical: [
          { _id: "AI Business Solutions", count: 8 },
          { _id: "AI Learning", count: 5 },
        ],
        byStatus: [{ _id: "New", count: 4 }],
        productInterests: [{ count: 2 }],
        communityEnquiries: [{ count: 3 }],
      },
    ]);
    getDemoAnalytics.mockReset().mockResolvedValue({
      totals: {
        views: 10,
        launches: 6,
        successes: 5,
        failures: 1,
        enquiryConversions: 2,
      },
      retentionDays: 180,
    });
    getEmployeeReport.mockReset().mockResolvedValue({
      departments: [
        { _id: "Engineering", employees: 4, active: 3 },
        { _id: "Learning", employees: 2, active: 2 },
      ],
      projects: [
        { _id: "planned", count: 1 },
        { _id: "in_progress", count: 2 },
      ],
    });
  });

  it("reports persisted cross-platform counts without implying concepts are live products", async () => {
    const result = await getDashboardAnalytics();

    expect(result).toMatchObject({
      businessEnquiries: 8,
      learningEnquiries: 5,
      productInterests: 2,
      communityEnquiries: 3,
      employees: 5,
      departments: 2,
      projects: 3,
      demoRetentionDays: 180,
      demos: { views: 10, launches: 6, successes: 5 },
    });
  });
});
