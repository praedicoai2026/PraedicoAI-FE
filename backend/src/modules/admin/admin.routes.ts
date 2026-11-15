import { Router } from "express";
import {
  listAdminAccountsController,
  requireAdminManagement,
  updateAdminAccountController,
} from "./admin.controller.js";

export const adminRouter = Router();

adminRouter.use(requireAdminManagement);
adminRouter.get("/accounts", listAdminAccountsController);
adminRouter.patch("/accounts/:id", updateAdminAccountController);
