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
        title: "Contact form submissions",
        paragraphs: [
          "Before a contact inquiry can be sent, a six-digit verification code is emailed to the address you provide. The code expires after the period configured by the website operator; temporary verification state is held in server memory and removed when used or expired. After verification, the inquiry is emailed to PraedicoAI over an encrypted SMTP connection, and a receipt containing the inquiry type and subject is sent to that verified address. Contact submissions are not stored in a database or user account. The email provider and recipient mailboxes may process and retain these messages under their own terms and settings.",
        ],
      },
      {
        title: "Other inquiry forms",
        paragraphs: [
          "Proposal, consultation, and training forms currently prepare a message in your email application. You must review and manually send those messages. Your email application and its provider may handle, store, or transmit that information according to their own terms and settings.",
        ],
      },
      {
        title: "Copying information",
        paragraphs: [
          "The copy buttons write to your clipboard only after you choose them. Other applications or your operating system may retain clipboard history. Use discretion with any information you copy.",
        ],
      },
      {
        title: "Account information and email",
        paragraphs: [
          "When you create an account, the service stores your name, email address, phone number, account type, selected course category and course, optional organization details, and a password hash in its MongoDB account database. Active sign-in sessions are stored to keep you signed in and can be removed by signing out or resetting your password. The raw password is not stored. If you request a password reset, a one-time link is emailed through the configured SMTP provider and expires after 30 minutes. Contact-form email is handled separately. The site does not currently provide a CRM or accept payments.",
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
          "Any contact address displayed on this site must be verified before use. This draft describes only the current website behavior, not any future service or data-processing activity.",
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
          "Do not provide passwords, secrets, confidential employer or customer information, or sensitive personal records through an inquiry. Contact-form details are emailed to PraedicoAI; other inquiry forms currently prepare email drafts for you to send. No guaranteed technical, marketing, ranking, or business outcome is offered.",
        ],
      },
      {
        title: "Accounts",
        paragraphs: [
          "Keep your sign-in credentials private and use accurate information when creating an account. You are responsible for activity performed through your account. Password reset links are single-use and expire after 30 minutes. Account functionality and program choices do not confirm enrollment, course availability, or a scheduled training engagement.",
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
