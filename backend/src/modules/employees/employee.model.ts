import { Schema, model } from "mongoose";

const employeeProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    department: { type: String, required: true, maxlength: 100, trim: true },
    jobTitle: { type: String, required: true, maxlength: 100, trim: true },
    managerId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    workStatus: {
      type: String,
      enum: ["active", "on_leave", "inactive"],
      default: "active",
      required: true,
    },
  },
  { timestamps: true, collection: "employee_profiles" },
);

employeeProfileSchema.index({ department: 1, workStatus: 1 });

export const EmployeeProfile = model("EmployeeProfile", employeeProfileSchema);
