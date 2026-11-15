import { z } from "zod";
import { demoCategories, demoPrompts } from "./demo.registry.js";

const demoSlugs = demoPrompts.map(({ slug }) => slug) as [
  (typeof demoPrompts)[number]["slug"],
  ...(typeof demoPrompts)[number]["slug"][],
];

export const demoSlugSchema = z.enum(demoSlugs);
export const demoCategorySchema = z.enum(demoCategories);

export const executeDemoSchema = z
  .object({
    slug: demoSlugSchema,
    category: demoCategorySchema,
    input: z.string().trim().min(3).max(5000),
    ageConfirmed: z.literal(true),
    dataPolicyAccepted: z.literal(true),
    countryCode: z.string().regex(/^[A-Z]{2}$/),
    rateLimitKey: z.string().regex(/^[a-f0-9]{64}$/),
  })
  .strict();

export const trackDemoEventSchema = z
  .object({
    slug: demoSlugSchema,
    category: demoCategorySchema,
    eventType: z.enum(["view"]),
    rateLimitKey: z.string().regex(/^[a-f0-9]{64}$/),
  })
  .strict();

export type ExecuteDemoInput = z.infer<typeof executeDemoSchema>;
export type TrackDemoEventInput = z.infer<typeof trackDemoEventSchema>;
