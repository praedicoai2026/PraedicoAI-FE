import type { Event } from "@/types/content";
import { faqs } from "./faqs";
export const eventTypes = [
  "Webinar",
  "Seminar",
  "Workshop",
  "Conference",
  "Technology showcase",
  "Speaking session",
  "Training event",
];
export const events: Event[] = [
  {
    slug: "architecture-conversation",
    title: "Making architecture decisions visible",
    type: "Webinar",
    topic: "Software architecture",
    mode: "Online",
    status: "Upcoming",
    summary:
      "A proposed conversation on boundaries, trade-offs, and documentation that people actually use.",
    agenda: [
      "Frame a technical decision",
      "Compare options and constraints",
      "Write a short decision record",
      "Open discussion",
    ],
    outcomes: [
      "A structure for discussing trade-offs",
      "A practical decision-record example",
    ],
  },
  {
    slug: "ai-awareness-workshop",
    title: "From AI curiosity to a useful question",
    type: "Workshop",
    topic: "AI fundamentals",
    mode: "In-person",
    status: "Upcoming",
    summary:
      "A sample workshop exploring realistic AI opportunities and the importance of human review.",
    agenda: [
      "AI concepts without the hype",
      "Identify a bounded use case",
      "Map information risks",
      "Share proposed guardrails",
    ],
    outcomes: ["A draft use-case question", "A human-oversight checklist"],
  },
  {
    slug: "frontend-learning-session",
    title: "Frontend foundations: session archive",
    type: "Training event",
    topic: "Web development",
    mode: "Online",
    status: "Past",
    summary:
      "A sample archive entry showing how past learning sessions could be presented. No actual event is asserted.",
    agenda: [
      "Semantic page structure",
      "Reusable interface patterns",
      "Responsive layout review",
      "Learning reflections",
    ],
    outcomes: ["Example learning notes", "A suggested practice project"],
  },
].map((seed) => ({
  ...seed,
  status: seed.status as Event["status"],
  date: "[Add verified event date]",
  time: "[Add event time]",
  timeZone: "[Confirm time zone]",
  category: seed.topic,
  tags: [seed.type, seed.mode],
  label: "Sample event · Not scheduled",
  image: "/images/events/session.png",
  imageAlt: "Abstract presentation and discussion layout",
  audience: ["Professionals", "Students", "Technology teams"],
  sections: [
    {
      title: "Overview",
      paragraphs: [
        seed.summary,
        "This is a demonstration event entry, not an announced or confirmed session. Dates, location, and availability must be verified separately.",
      ],
    },
  ],
  faqs: [faqs[6], faqs[4]],
}));
export const getEventBySlug = (slug: string) =>
  events.find((event) => event.slug === slug);
