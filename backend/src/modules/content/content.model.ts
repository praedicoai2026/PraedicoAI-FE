import { Schema, model } from "mongoose";

const contentEntrySchema = new Schema(
  {
    type: {
      type: String,
      enum: ["article", "resource", "event", "product", "research", "community"],
      required: true,
      index: true,
    },
    slug: { type: String, required: true, unique: true, maxlength: 120 },
    title: { type: String, required: true, maxlength: 160 },
    summary: { type: String, required: true, maxlength: 400 },
    body: { type: String, required: true, maxlength: 6000 },
    seoTitle: { type: String, required: true, maxlength: 160 },
    seoDescription: { type: String, required: true, maxlength: 300 },
    status: {
      type: String,
      enum: ["draft", "review", "published", "archived"],
      default: "draft",
      required: true,
      index: true,
    },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reviewerId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true, collection: "content_entries" },
);

contentEntrySchema.index({ status: 1, updatedAt: -1 });

export const ContentEntry = model("ContentEntry", contentEntrySchema);
