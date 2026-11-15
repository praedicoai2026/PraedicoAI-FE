import type { RequestHandler } from "express";
import { getDashboardAnalytics } from "./dashboard.service.js";

export const dashboardAnalyticsController: RequestHandler = async (
  _request,
  response,
  next,
) => {
  try {
    response.status(200).json({ data: await getDashboardAnalytics() });
  } catch (error) {
    next(error);
  }
};
