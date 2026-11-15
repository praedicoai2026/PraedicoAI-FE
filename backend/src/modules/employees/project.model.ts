import { Schema, model } from "mongoose";

const projectSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 120, trim: true },
    description: { type: String, required: true, maxlength: 1000, trim: true },
    status: {
      type: String,
      enum: ["planned", "in_progress", "on_hold", "completed"],
      default: "planned",
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    memberIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
  },
  { timestamps: true, collection: "projects" },
);

projectSchema.index({ memberIds: 1, status: 1 });

export const Project = model("Project", projectSchema);
