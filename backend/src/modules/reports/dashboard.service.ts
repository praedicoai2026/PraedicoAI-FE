import { Lead } from "../leads/lead.model.js";
import { getEmployeeReport } from "../employees/employee.service.js";
import { getDemoAnalytics } from "../demos/demo.service.js";

export async function getDashboardAnalytics() {
  const [leadRows, demos, workforce] = await Promise.all([
    Lead.aggregate([
      {
        $facet: {
          totalsByVertical: [
            { $group: { _id: "$vertical", count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
          ],
          byStatus: [
            { $group: { _id: "$status", count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
          ],
          productInterests: [
            { $match: { category: "AI Product Interest" } },
            { $count: "count" },
          ],
          communityEnquiries: [
            { $match: { category: "AI Community" } },
            { $count: "count" },
          ],
        },
      },
    ]),
    getDemoAnalytics(),
    getEmployeeReport(),
  ]);
  const leads = leadRows[0];
  return {
    generatedAt: new Date().toISOString(),
    businessEnquiries:
      leads?.totalsByVertical?.find(
        (row: { _id: string }) => row._id === "AI Business Solutions",
      )?.count ?? 0,
    learningEnquiries:
      leads?.totalsByVertical?.find(
        (row: { _id: string }) => row._id === "AI Learning",
      )?.count ?? 0,
    productInterests: leads?.productInterests?.[0]?.count ?? 0,
    communityEnquiries: leads?.communityEnquiries?.[0]?.count ?? 0,
    leadStatuses: leads?.byStatus ?? [],
    demos: demos.totals,
    demoRetentionDays: demos.retentionDays,
    employees: workforce.departments.reduce(
      (total, department) => total + department.active,
      0,
    ),
    departments: workforce.departments.length,
    projects: workforce.projects.reduce(
      (total, project) => total + project.count,
      0,
    ),
    projectsByStatus: workforce.projects,
  };
}
