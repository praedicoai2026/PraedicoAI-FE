import { Types, type PipelineStage } from "mongoose";
import { HttpError } from "../../errors/http-error.js";
import { User } from "../auth/user.model.js";
import { Lead } from "./lead.model.js";
import type {
  LeadCategory,
  LeadListQuery,
  LeadSubmission,
  LeadUpdate,
} from "./lead.schema.js";

const businessCategories = new Set<LeadCategory>([
  "AI Business Solutions",
  "AI Consulting",
  "AI Automation",
  "AI Application Development",
  "AI Product Interest",
]);
const applicationCategories = new Set<LeadCategory>(["AI Internships"]);
const registrationCategories = new Set<LeadCategory>([
  "Student AI Training",
  "Professional AI Training",
  "AI Community",
  "AI Research Interest",
]);

export function deriveLeadClassification(category: LeadCategory) {
  const vertical = businessCategories.has(category)
    ? "AI Business Solutions"
    : "AI Learning";
  const recordType = businessCategories.has(category)
    ? "business"
    : applicationCategories.has(category)
      ? "application"
      : registrationCategories.has(category)
        ? "registration"
        : category === "College Partnerships"
          ? "partnership"
          : "business";

  return { vertical, recordType };
}

export async function createLead(input: LeadSubmission) {
  const { vertical, recordType } = deriveLeadClassification(input.category);
  const { consent, website, ...leadFields } = input;
  if (consent !== true) {
    throw new HttpError(
      400,
      "CONSENT_REQUIRED",
      "Consent is required to submit this enquiry.",
    );
  }
  if (website?.trim()) {
    throw new HttpError(
      400,
      "SPAM_DETECTED",
      "The enquiry could not be accepted.",
    );
  }
  const now = new Date();
  return Lead.create({
    ...leadFields,
    vertical,
    recordType,
    consentedAt: now,
    status: "New",
    statusHistory: [{ status: "New", changedAt: now, changedBy: "system" }],
  });
}

export async function listLeads(
  query: LeadListQuery,
  verticalScope?: "AI Learning",
) {
  const filter: Record<string, unknown> = {};
  if (query.category) filter.category = query.category;
  if (verticalScope) filter.vertical = verticalScope;
  else if (query.vertical) filter.vertical = query.vertical;
  if (query.status) filter.status = query.status;
  if (query.search) {
    const escapedSearch = query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const expression = new RegExp(escapedSearch, "i");
    filter.$or = [
      { name: expression },
      { email: expression },
      { company: expression },
      { institution: expression },
      { college: expression },
    ];
  }

  const skip = (query.page - 1) * query.limit;
  const [leads, total] = await Promise.all([
    Lead.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(query.limit)
      .lean(),
    Lead.countDocuments(filter),
  ]);
  return { leads, total, page: query.page, limit: query.limit };
}

export async function getLeadAnalytics(verticalScope?: "AI Learning") {
  const pipeline: PipelineStage[] = [
    ...(verticalScope ? [{ $match: { vertical: verticalScope } }] : []),
    {
      $facet: {
        totals: [{ $count: "count" }],
        byVertical: [
          { $group: { _id: "$vertical", count: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ],
        byStatus: [
          { $group: { _id: "$status", count: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ],
        byRecordType: [
          { $group: { _id: "$recordType", count: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ],
      },
    },
  ];
  const [result] = await Lead.aggregate(pipeline);

  return {
    total: result?.totals[0]?.count ?? 0,
    byVertical: result?.byVertical ?? [],
    byStatus: result?.byStatus ?? [],
    byRecordType: result?.byRecordType ?? [],
  };
}

export async function updateLead(
  id: string,
  update: LeadUpdate,
  admin: { name: string; email: string },
  verticalScope?: "AI Learning",
) {
  if (!Types.ObjectId.isValid(id)) {
    throw new HttpError(404, "LEAD_NOT_FOUND", "This lead could not be found.");
  }

  const lead = await Lead.findById(id);
  if (!lead || (verticalScope && lead.vertical !== verticalScope)) {
    throw new HttpError(404, "LEAD_NOT_FOUND", "This lead could not be found.");
  }

  if (update.status && update.status !== lead.status) {
    lead.status = update.status;
    lead.statusHistory.push({
      status: update.status,
      changedAt: new Date(),
      changedBy: admin.email,
    });
  }
  if (update.assignee !== undefined) {
    if (update.assignee) {
      const assignee = await User.findOne({
        email: update.assignee.email,
        role: { $in: ["staff", "admin"] },
      })
        .select("fullName email")
        .lean();
      if (!assignee) {
        throw new HttpError(
          400,
          "INVALID_ASSIGNEE",
          "Choose an authorized team member.",
        );
      }
      lead.assignee = { name: assignee.fullName, email: assignee.email };
    } else {
      lead.assignee = undefined;
    }
  }
  if (update.followUpAt !== undefined) {
    lead.followUpAt = update.followUpAt
      ? new Date(update.followUpAt)
      : undefined;
  }
  if (update.note) {
    lead.notes.push({
      text: update.note,
      authorName: admin.name,
      authorEmail: admin.email,
      createdAt: new Date(),
    });
  }
  await lead.save();
  return lead;
}

export async function getLeadsForExport(
  query: Omit<LeadListQuery, "page" | "limit">,
  verticalScope?: "AI Learning",
) {
  const filter: Record<string, unknown> = {};
  if (query.category) filter.category = query.category;
  if (verticalScope) filter.vertical = verticalScope;
  else if (query.vertical) filter.vertical = query.vertical;
  if (query.status) filter.status = query.status;
  if (query.search) {
    const escapedSearch = query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const expression = new RegExp(escapedSearch, "i");
    filter.$or = [
      { name: expression },
      { email: expression },
      { company: expression },
      { institution: expression },
      { college: expression },
    ];
  }

  const [leads, total] = await Promise.all([
    Lead.find(filter).sort({ createdAt: -1, _id: -1 }).limit(10_000).lean(),
    Lead.countDocuments(filter),
  ]);
  return { leads, total, truncated: total > leads.length };
}
