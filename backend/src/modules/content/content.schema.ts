import { z } from "zod";

const slug = z
  .string()
  .trim()
  .min(3)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const contentFields = {
  type: z.enum([
    "article",
    "resource",
    "event",
    "product",
    "research",
    "community",
  ]),
  slug,
  title: z.string().trim().min(3).max(160),
  summary: z.string().trim().min(10).max(400),
  body: z.string().trim().min(20).max(6000),
  seoTitle: z.string().trim().min(3).max(160),
  seoDescription: z.string().trim().min(20).max(300),
};
const status = z.enum(["draft", "review", "published", "archived"]);

export const contentCreateSchema = z
  .object({ ...contentFields, status: status.default("draft") })
  .strict();

export const contentUpdateSchema = z
  .object({
    ...contentFields,
    type: contentFields.type.optional(),
    slug: contentFields.slug.optional(),
    title: contentFields.title.optional(),
    summary: contentFields.summary.optional(),
    body: contentFields.body.optional(),
    seoTitle: contentFields.seoTitle.optional(),
    seoDescription: contentFields.seoDescription.optional(),
    status: status.optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Add at least one content change.",
  });

export type ContentCreate = z.infer<typeof contentCreateSchema>;
export type ContentUpdate = z.infer<typeof contentUpdateSchema>;
