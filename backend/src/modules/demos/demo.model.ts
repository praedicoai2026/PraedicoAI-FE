import { Schema, model } from "mongoose";
import { demoCategories, demoPrompts } from "./demo.registry.js";

const demoUsageSchema = new Schema(
  {
    slug: {
      type: String,
      enum: demoPrompts.map(({ slug }) => slug),
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: demoCategories,
      required: true,
      index: true,
    },
    eventType: {
      type: String,
      enum: ["view", "launch", "success", "failure"],
      required: true,
      index: true,
    },
    durationMs: { type: Number, min: 0 },
    inputCharacters: { type: Number, min: 0 },
    outputCharacters: { type: Number, min: 0 },
    promptTokens: { type: Number, min: 0 },
    completionTokens: { type: Number, min: 0 },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: "demo_usage",
  },
);

demoUsageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 15_552_000 });

export const DemoUsage = model("DemoUsage", demoUsageSchema);
