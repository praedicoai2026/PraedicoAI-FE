import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import {
  adminLeadAnalytics,
  exportAdminLeads,
  listAdminTeam,
  listAdminLeads,
  requireLeadAssign,
  requireLeadExport,
  requireLeadRead,
  requireLeadWrite,
  submitLead,
  updateAdminLead,
} from "./lead.controller.js";

export const leadRouter = Router();

const leadSubmissionRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: {
      code: "RATE_LIMITED",
      message: "Too many enquiry submissions. Please try again later.",
    },
  },
});

leadRouter.post("/", leadSubmissionRateLimit, submitLead);
leadRouter.get("/admin/analytics", requireLeadRead, adminLeadAnalytics);
leadRouter.get("/admin/team", requireLeadAssign, listAdminTeam);
leadRouter.get("/admin/export.csv", requireLeadExport, exportAdminLeads);
leadRouter.get("/admin", requireLeadRead, listAdminLeads);
leadRouter.patch("/admin/:id", requireLeadWrite, updateAdminLead);
