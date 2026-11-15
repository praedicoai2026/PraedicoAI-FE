import { z } from "zod";

const challengeId = z.string().regex(/^[a-f0-9]{64}$/);
const email = z
  .string()
  .trim()
  .email()
  .max(254)
  .transform((value) => value.toLowerCase());

export const contactOtpActionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("request"), email }).strict(),
  z
    .object({
      action: z.literal("verify"),
      challengeId,
      code: z.string().regex(/^\d{6}$/),
    })
    .strict(),
  z.object({ action: z.literal("claim"), challengeId, email }).strict(),
  z.object({ action: z.literal("release"), challengeId, email }).strict(),
  z.object({ action: z.literal("consume"), challengeId, email }).strict(),
  z.object({ action: z.literal("discard"), challengeId }).strict(),
]);

export type ContactOtpAction = z.infer<typeof contactOtpActionSchema>;
