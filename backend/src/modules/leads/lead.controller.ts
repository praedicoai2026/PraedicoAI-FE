import type { RequestHandler, Response } from "express";
import { requirePermission } from "../auth/authorization.js";
import { isAuthorizedInternalRequest } from "../auth/auth.service.js";
import { User } from "../auth/user.model.js";
import {
  leadListQuerySchema,
  leadSubmissionSchema,
  leadUpdateSchema,
} from "./lead.schema.js";
import {
  createLead,
  getLeadAnalytics,
  getLeadsForExport,
  listLeads,
  updateLead,
} from "./lead.service.js";
import type { UserRole } from "../auth/roles.js";

type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
};

export const requireLeadRead = requirePermission("leads:read");
export const requireLeadWrite = requirePermission("leads:write");
export const requireLeadAssign = requirePermission("leads:assign");
export const requireLeadExport = requirePermission("leads:export");

function getLeadScope(response: Response) {
  const user = response.locals.adminUser as AdminUser | undefined;
  return user?.role === "training_manager" ? "AI Learning" : undefined;
}

export const submitLead: RequestHandler = async (request, response, next) => {
  if (!isAuthorizedInternalRequest(request.header("x-auth-internal-secret"))) {
    response.status(403).json({
      error: { code: "FORBIDDEN", message: "This request is not allowed." },
    });
    return;
  }

  const result = leadSubmissionSchema.safeParse(request.body);
  if (!result.success) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Check the submitted information and try again.",
        fields: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
    return;
  }
  if (result.data.website?.trim()) {
    response.status(400).json({
      error: {
        code: "SPAM_DETECTED",
        message: "The enquiry could not be accepted.",
      },
    });
    return;
  }

  try {
    const lead = await createLead(result.data);
    response.status(201).json({
      data: { id: lead._id.toString(), category: lead.category },
    });
  } catch (error) {
    next(error);
  }
};

export const listAdminLeads: RequestHandler = async (
  request,
  response,
  next,
) => {
  const parsed = leadListQuerySchema.safeParse(request.query);
  if (!parsed.success) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "The requested lead filters are invalid.",
      },
    });
    return;
  }

  try {
    const result = await listLeads(parsed.data, getLeadScope(response));
    response.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export const adminLeadAnalytics: RequestHandler = async (
  _request,
  response,
  next,
) => {
  try {
    response
      .status(200)
      .json({ data: await getLeadAnalytics(getLeadScope(response)) });
  } catch (error) {
    next(error);
  }
};

export const listAdminTeam: RequestHandler = async (
  _request,
  response,
  next,
) => {
  try {
    const team = await User.find({ role: { $in: ["staff", "admin"] } })
      .select("fullName email role")
      .sort({ fullName: 1 })
      .lean();
    response.status(200).json({
      data: {
        team: team.map((member) => ({
          name: member.fullName,
          email: member.email,
          role: member.role,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdminLead: RequestHandler = async (
  request,
  response,
  next,
) => {
  const result = leadUpdateSchema.safeParse(request.body);
  if (!result.success) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Check the lead update and try again.",
        fields: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
    return;
  }

  try {
    const id = request.params.id;
    if (typeof id !== "string") {
      response.status(404).json({
        error: {
          code: "LEAD_NOT_FOUND",
          message: "This lead could not be found.",
        },
      });
      return;
    }
    const admin = response.locals.adminUser as AdminUser;
    const lead = await updateLead(id, result.data, {
      name: admin.fullName,
      email: admin.email,
    }, getLeadScope(response));
    response.status(200).json({ data: { lead } });
  } catch (error) {
    next(error);
  }
};

export const exportAdminLeads: RequestHandler = async (
  request,
  response,
  next,
) => {
  const parsed = leadListQuerySchema
    .omit({ page: true, limit: true })
    .safeParse(request.query);
  if (!parsed.success) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "The requested lead filters are invalid.",
      },
    });
    return;
  }

  try {
    const result = await getLeadsForExport(
      parsed.data,
      getLeadScope(response),
    );
    const columns = [
      "createdAt",
      "name",
      "email",
      "phone",
      "category",
      "vertical",
      "recordType",
      "status",
      "company",
      "institution",
      "designation",
      "industry",
      "businessProblem",
      "requiredAISolution",
      "budgetRange",
      "preferredContactMethod",
      "college",
      "courseDegree",
      "currentYear",
      "currentProfession",
      "experience",
      "interestedAIProgram",
      "internshipInterest",
      "learningObjectives",
      "interestArea",
      "partnershipGoal",
      "targetAudience",
      "estimatedParticipants",
      "assignee.name",
      "assignee.email",
      "followUpAt",
      "notes",
    ];
    const rows = result.leads.map((lead) =>
      columns
        .map((column) =>
          csvValue(
            column === "notes"
              ? lead.notes?.map((note) => note.text).join("\n")
              : getColumnValue(lead, column),
          ),
        )
        .join(","),
    );
    const csv = `\uFEFF${columns.map(csvValue).join(",")}\r\n${rows.join("\r\n")}`;
    response
      .status(200)
      .set("Content-Type", "text/csv; charset=utf-8")
      .set("Content-Disposition", 'attachment; filename="praedicoai-leads.csv"')
      .set("Cache-Control", "no-store")
      .set("X-Export-Truncated", String(result.truncated))
      .send(csv);
  } catch (error) {
    next(error);
  }
};

function getColumnValue(lead: Record<string, unknown>, column: string) {
  if (column === "createdAt" || column === "followUpAt") {
    const value = lead[column];
    return value instanceof Date ? value.toISOString() : value;
  }
  if (column.startsWith("assignee.")) {
    const assignee = lead.assignee;
    return typeof assignee === "object" && assignee !== null
      ? (assignee as Record<string, unknown>)[column.slice("assignee.".length)]
      : "";
  }
  return lead[column];
}

function csvValue(value: unknown) {
  let text = value === null || value === undefined ? "" : String(value);
  if (/^[\t\r ]*[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}
