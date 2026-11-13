import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    fullName: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true, maxlength: 254, unique: true },
    passwordHash: { type: String, required: true, maxlength: 255 },
    phone: { type: String, required: true, maxlength: 30 },
    accountType: {
      type: String,
      enum: ["individual", "business"],
      required: true,
    },
    courseCategory: { type: String, required: true, maxlength: 120 },
    courseName: { type: String, required: true, maxlength: 200 },
    companyName: { type: String, maxlength: 150 },
    companyWebsite: { type: String, maxlength: 2048 },
    companyDescription: { type: String, maxlength: 2000 },
    otherInformation: { type: String, maxlength: 2000 },
    termsAcceptedAt: { type: Date, required: true },
    passwordResetTokenHash: { type: String, select: false },
    passwordResetExpiresAt: { type: Date, select: false },
  },
  {
    timestamps: true,
    collection: "users",
  },
);

export const User = model("User", userSchema);
