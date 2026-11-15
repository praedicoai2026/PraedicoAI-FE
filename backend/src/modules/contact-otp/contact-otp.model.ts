import { Schema, model } from "mongoose";

const contactOtpSchema = new Schema(
  {
    email: { type: String, required: true },
    challengeId: { type: String, required: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    sentAt: { type: Date, required: true },
    attempts: { type: Number, required: true, min: 0, default: 0 },
    verifiedAt: { type: Date, default: null },
    claimedAt: { type: Date, default: null },
  },
  { collection: "contact_email_otps", versionKey: false },
);

contactOtpSchema.index({ email: 1 }, { unique: true });
contactOtpSchema.index({ challengeId: 1 }, { unique: true });
contactOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const ContactOtpChallenge = model(
  "ContactOtpChallenge",
  contactOtpSchema,
);
