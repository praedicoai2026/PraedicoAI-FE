import { Types } from "mongoose";
import { HttpError } from "../../errors/http-error.js";
import { ContentEntry } from "./content.model.js";
import type { ContentCreate, ContentUpdate } from "./content.schema.js";

export async function listManagedContent() {
  return ContentEntry.find()
    .select(
      "type slug title summary body seoTitle seoDescription status authorId reviewerId publishedAt createdAt updatedAt",
    )
    .sort({ updatedAt: -1, _id: -1 })
    .lean();
}

export async function createContent(
  input: ContentCreate,
  authorId: string,
) {
  try {
    return await ContentEntry.create({
      ...input,
      authorId: new Types.ObjectId(authorId),
      reviewerId:
        input.status === "published" ? new Types.ObjectId(authorId) : null,
      publishedAt: input.status === "published" ? new Date() : null,
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      throw new HttpError(
        409,
        "CONTENT_SLUG_TAKEN",
        "A content entry already uses this URL slug.",
      );
    }
    throw error;
  }
}

export async function updateContent(
  id: string,
  input: ContentUpdate,
  reviewerId: string,
) {
  if (!Types.ObjectId.isValid(id)) {
    throw new HttpError(404, "CONTENT_NOT_FOUND", "Content entry not found.");
  }
  const content = await ContentEntry.findById(id);
  if (!content) {
    throw new HttpError(404, "CONTENT_NOT_FOUND", "Content entry not found.");
  }
  const contentFieldsChanged = Object.keys(input).some(
    (field) => field !== "status",
  );
  Object.assign(content, input);
  if (input.status === "published") {
    content.reviewerId = new Types.ObjectId(reviewerId);
    content.publishedAt ??= new Date();
  } else if (input.status === "archived") {
    content.reviewerId = new Types.ObjectId(reviewerId);
  } else if (contentFieldsChanged && input.status === undefined) {
    content.status = "draft";
    content.publishedAt = null;
  } else if (input.status === "draft" || input.status === "review") {
    content.publishedAt = null;
  }
  await content.save();
  return content;
}

export async function getPublishedContent(slug: string) {
  const content = await ContentEntry.findOne({ slug, status: "published" })
    .select(
      "type slug title summary body seoTitle seoDescription publishedAt updatedAt",
    )
    .lean();
  return content;
}

export async function listPublishedContent() {
  return ContentEntry.find({ status: "published" })
    .select("type slug title summary seoTitle seoDescription publishedAt updatedAt")
    .sort({ publishedAt: -1, _id: -1 })
    .lean();
}
