import { Schema, model } from "mongoose";

const adminAuditSchema = new Schema(
  {
    actorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    actorEmail: { type: String, required: true, maxlength: 254 },
    targetId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetEmail: { type: String, required: true, maxlength: 254 },
    action: {
      type: String,
      enum: ["admin-account-updated"],
      required: true,
    },
    beforeRole: { type: String, required: true, maxlength: 40 },
    afterRole: { type: String, required: true, maxlength: 40 },
    beforeActive: { type: Boolean, required: true },
    afterActive: { type: Boolean, required: true },
    permissionsChanged: { type: Boolean, required: true },
    beforePermissions: { type: [String], required: true },
    afterPermissions: { type: [String], required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: "admin_audit",
  },
);

adminAuditSchema.index({ createdAt: -1 });
adminAuditSchema.index({ targetId: 1, createdAt: -1 });

export const AdminAudit = model("AdminAudit", adminAuditSchema);
