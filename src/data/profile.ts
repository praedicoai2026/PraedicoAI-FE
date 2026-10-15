import type {
  Certification,
  Education,
  Experience,
  Testimonial,
} from "@/types/content";
export const experiences: Experience[] = [
  "Numeric Info Systems Pvt Ltd",
  "Praedic Global Research Pvt Ltd",
  "LTM Ltd",
  "Birlasoft Ltd",
  "HCLTech",
  "Bayer",
].map((organization) => ({
  organization,
  role: "[Add verified job title]",
  dates: "[Add employment date]",
  description:
    "[Add verified responsibilities and non-confidential experience]. Listed for configuration; chronology has not been verified.",
}));
export const education: Education[] = ["BSc", "MSc", "MPhil", "PhD"].map(
  (degree) => ({
    degree,
    institution: "[Add university name]",
    subject: "[Add subject]",
    startDate: "[Add start date]",
    completionDate: "[Add completion date]",
    description:
      "[Add verified education description]. Placeholder entry, not a claim of an awarded qualification.",
  }),
);
export const certifications: Certification[] = [
  {
    name: "[Add certification]",
    issuer: "[Add issuer]",
    date: "[Add date]",
    credentialId: "[Add credential ID]",
    skills: ["[Add verified skills]"],
    image: "/images/placeholders/certificate.png",
  },
];
export const testimonials: Testimonial[] = [
  {
    id: "sample-feedback",
    quote:
      "[Add a verified testimonial about the engagement, learning experience, or collaboration, with the author's permission.]",
    attribution: "[Add verified name and role]",
    note: "Sample testimonial. Replace with verified testimonial.",
  },
];
export const speakingFormats = [
  "Webinars",
  "Seminars",
  "Technology showcases",
  "Architecture presentations",
  "Workshops",
  "Training sessions",
  "Panel discussions",
  "Knowledge-sharing sessions",
];
