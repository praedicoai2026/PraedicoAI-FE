import { z } from "zod";

export const registrationSchema = z
  .object({
    fullName: z.string().trim().min(2).max(100),
    email: z
      .string()
      .trim()
      .email()
      .max(254)
      .transform((email) => email.toLowerCase()),
    phone: z.string().trim().min(7).max(30),
    accountType: z.enum(["individual", "business"]),
    courseCategory: z.string().trim().min(2).max(120),
    courseName: z.string().trim().min(2).max(200),
    companyName: z.string().trim().max(150).optional().default(""),
    companyWebsite: z
      .union([z.literal(""), z.string().trim().url().max(2048)])
      .optional()
      .default(""),
    companyDescription: z.string().trim().max(2000).optional().default(""),
    otherInformation: z.string().trim().max(2000).optional().default(""),
    termsAccepted: z.literal(true),
    password: z
      .string()
      .min(12)
      .max(72)
      .refine(
        (password) => Buffer.byteLength(password, "utf8") <= 72,
        "Password must be no more than 72 bytes.",
      ),
    confirmPassword: z.string(),
  })
  .strict()
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })
  .refine(
    (value) =>
      value.accountType !== "business" ||
      (value.companyName.length > 0 && value.companyDescription.length > 0),
    {
      message:
        "Company name and a short description are required for business accounts.",
      path: ["companyName"],
    },
  );

export const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email()
      .max(254)
      .transform((email) => email.toLowerCase()),
    password: z.string().min(1).max(72),
  })
  .strict();

export const passwordResetRequestSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email()
      .max(254)
      .transform((email) => email.toLowerCase()),
  })
  .strict();

export const passwordResetSchema = z
  .object({
    token: z.string().min(32).max(200),
    password: z
      .string()
      .min(12)
      .max(72)
      .refine(
        (password) => Buffer.byteLength(password, "utf8") <= 72,
        "Password must be no more than 72 bytes.",
      ),
  })
  .strict();

export type RegistrationInput = z.infer<typeof registrationSchema>;
