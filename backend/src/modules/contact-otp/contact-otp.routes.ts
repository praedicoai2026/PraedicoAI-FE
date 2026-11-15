import { Router } from "express";
import { contactOtpController } from "./contact-otp.controller.js";

export const contactOtpRouter = Router();

contactOtpRouter.post("/", contactOtpController);
