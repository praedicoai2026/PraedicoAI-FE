import type { ContentSection } from "@/types/content";
export const legalNote =
  "Draft policy text for PraedicoAI Services Private Limited. Have a qualified professional review it against the company's actual services, operations, and applicable law before publication.";
export const legalPages: Record<
  string,
  { title: string; description: string; sections: ContentSection[] }
> = {
  privacy: {
    title: "Privacy",
    description:
      "How this website currently handles information and what to consider before contacting PraedicoAI.",
    sections: [
      {
        title: "Forms stay in your browser",
        paragraphs: [
          "Forms are not submitted to a server. Form data is not stored by this application. The values remain in the current page only while you prepare your inquiry; the application does not save them to localStorage, a database, or an account.",
        ],
      },
      {
        title: "Email is sent by you",
        paragraphs: [
          "The application uses mailto links to ask your browser to open your email application with a prepared message. You must review and manually send that email. Your email application and its provider may handle, store, or transmit that information according to their own terms and settings.",
        ],
      },
      {
        title: "Copying information",
        paragraphs: [
          "The copy buttons write to your clipboard only after you choose them. Other applications or your operating system may retain clipboard history. Use discretion with any information you copy.",
        ],
      },
      {
        title: "What is not connected",
        paragraphs: [
          "This website currently has no database, email API, analytics provider, newsletter provider, user accounts, or authentication. It does not accept payments or register attendees. This description must be updated if those services are introduced.",
        ],
      },
      {
        title: "Theme preference",
        paragraphs: [
          "Only a light, dark, or system theme preference may be stored in your browser under the key pg-theme. This is not form information. Clearing site storage removes the preference.",
        ],
      },
      {
        title: "Local development and external links",
        paragraphs: [
          "Next.js development tooling can produce local request logs. Do not enter real sensitive information while experimenting. Following a social sharing link or opening an email application takes you to a separate service, with its own practices.",
        ],
      },
      {
        title: "Questions",
        paragraphs: [
          "The contact address displayed on this site is a placeholder and must be replaced and verified before use. This draft describes only the current website behavior, not any future service or data-processing activity.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms",
    description: "Draft terms for educational and demonstration use.",
    sections: [
      {
        title: "Learning purpose",
        paragraphs: [
          "These draft terms describe a public company website and do not form a project proposal, service agreement, or statement of availability.",
        ],
      },
      {
        title: "Sample content",
        paragraphs: [
          "Portfolio items and case studies are illustrative concepts, not client engagements or measured results. Course outlines and event examples are not confirmed schedules or accredited programs. No customer endorsements, certifications, or outcomes are claimed unless explicitly verified and published.",
        ],
      },
      {
        title: "Inquiries and scheduling",
        paragraphs: [
          "Preparing an inquiry does not submit a proposal, book a consultation, register a participant, or confirm availability. Any scope, timing, pricing, or engagement terms require a separate discussion.",
        ],
      },
      {
        title: "Responsible use",
        paragraphs: [
          "Do not provide passwords, secrets, confidential employer or customer information, or sensitive personal records. No guaranteed technical, marketing, ranking, or business outcome is offered.",
        ],
      },
    ],
  },
  cookies: {
    title: "Cookies & local preferences",
    description:
      "A simple explanation of browser storage currently used by this website.",
    sections: [
      {
        title: "No application tracking cookies",
        paragraphs: [
          "This website does not intentionally set advertising or analytics cookies and has no third-party tracking provider configured. This statement must be reviewed if the site's tools change.",
        ],
      },
      {
        title: "Theme storage",
        paragraphs: [
          "The theme switcher uses localStorage, not a cookie, to remember your light, dark, or system preference under pg-theme. No contact, proposal, consultation, or training values are written there.",
        ],
      },
      {
        title: "Your controls",
        paragraphs: [
          "Clear this site's browser storage to remove the saved theme. The interface also works without storage access; a preference may then last only for the current page session.",
        ],
      },
      {
        title: "Development tooling",
        paragraphs: [
          "Browser extensions, email applications, and development tools operate separately. Review them before making claims about a future production environment.",
        ],
      },
    ],
  },
  accessibility: {
    title: "Accessibility",
    description:
      "Design intentions, known limitations, and ways to report barriers.",
    sections: [
      {
        title: "Our approach",
        paragraphs: [
          "The interface uses semantic headings, labeled form controls, visible focus indicators, a skip link, keyboard-accessible navigation, native disclosure controls, and reduced-motion preferences.",
        ],
      },
      {
        title: "Forms and feedback",
        paragraphs: [
          "Validation errors are associated with fields. Status messages are announced in a polite live region. Copy and mailto actions include text alternatives and do not rely on color alone.",
        ],
      },
      {
        title: "Known limitations",
        paragraphs: [
          "The website has not been independently audited for accessibility conformance. External email applications, clipboard permissions, and social sharing services may have their own limitations. A full assistive-technology and device review is still needed.",
        ],
      },
      {
        title: "Report a barrier",
        paragraphs: [
          "After a verified contact address is configured, describe the affected page, device, browser, assistive technology if relevant, and the task that was difficult. Do not include sensitive information.",
        ],
      },
    ],
  },
};
