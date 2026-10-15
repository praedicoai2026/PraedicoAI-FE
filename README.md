# PraedicoAI Services Private Limited

A frontend-only company website for PraedicoAI Services Private Limited, with services, training, events, and a blog.

## Run Locally

Use Node.js 20.9 or newer and npm. This workspace was developed with Node.js 22.16. No environment variables or external services are required.

```powershell
npm install
npm run dev
```

Open http://localhost:3000, or the free port printed by Next.js. To choose a port explicitly, use `npx next dev --port 3001` from the project root.

| Command                | Purpose                                             |
| ---------------------- | --------------------------------------------------- |
| `npm install`          | Install dependencies                                |
| `npm run dev`          | Start local development                             |
| `npm run lint`         | Run ESLint with zero warnings allowed               |
| `npm run typecheck`    | Generate Next route types and run strict TypeScript |
| `npm run build`        | Create the local production build                   |
| `npm run start`        | Serve that build locally                            |
| `npm run format`       | Format source and documentation with Prettier       |
| `npm run format:check` | Check formatting without changes                    |

For production review, stop the dev server, run `npm run build`, then `npm run start`. Alternatively run `npx next start --port 3001` after building. No automated tests, testing libraries, test files, or test scripts are included. Use [MANUAL_TESTING_CHECKLIST.md](MANUAL_TESTING_CHECKLIST.md).

## Stack And Experience

Next.js App Router, React, strict TypeScript, Tailwind CSS, ESLint, Prettier, Lucide React, limited Framer Motion, `next/image`, and `next/font/local`. Static pages use Server Components; navigation, filtering, theme controls, inquiries, and interactive home sections use small Client Components.

The visual system uses white surfaces, dark ink typography, orange calls to action, and pale lavender section bands, inspired by the supplied Whatfix landing-page reference without reusing its branding, claims, or assets. Compact spacing and a centered hero keep the portfolio identity prominent. It includes staggered hero entrances, a brief name-accent animation, a pointer-responsive abstract backdrop with focus tabs, a category-based service explorer, scroll-triggered reveals, lifted card and button hover states, native FAQ disclosures, a mobile navigation dialog, light/dark/system themes, and visible keyboard focus. Cards also respond to keyboard focus. Tab controls support arrow keys, Home, and End. Reduced-motion preferences disable optional movement. The preview device may suppress animations when that preference is enabled.

## Scope And Honest Content

There is no backend, API route, Server Action, database, authentication, admin, CMS, CRM, email provider, analytics, payment system, booking integration, or event registration. There is no cloud, Docker, deployment, or CI/CD configuration. No environment variables are required; `.env.example` is intentionally comment-only.

Projects and case studies are demonstrations, not fabricated customer engagements. Employment dates/titles, institutions, qualifications, certifications, project outcomes, social URLs, and testimonials remain explicit placeholders until verified. Course outlines and event examples are not confirmed offerings. All imagery is original abstract placeholder artwork, not a portrait or evidence of delivered work. Legal pages contain draft text requiring professional review.

## Structure

```text
public/
	documents/       Local sample text downloads
	fonts/           Manrope and OFL license
	images/          Original abstract PNG placeholders
src/
	app/             Pages, layouts, metadata, error/loading states, styles
	components/
		cards/         Shared service, solution, content, and feedback cards
		forms/         Shared fields and four inquiry forms
		layout/        Footer and pre-footer CTA
		navigation/    Header, theme controls, mobile dialog
		sections/      Heroes, interactive services, catalogs, detail layouts
		ui/            Buttons, alerts, FAQs, filters, empty states, motion
	data/            Typed local content and field definitions
	hooks/           Theme preference behavior
	lib/             Mailto, filtering, formatting, metadata, route inventory
	types/           Content and inquiry contracts
```

## Routes

| Area         | Paths                                                                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home         | `/`                                                                                                                                               |
| About        | `/about`, `/about/experience`, `/about/education`, `/about/certifications`, `/about/speaking`                                                     |
| Services     | `/services`, `/services/[slug]`                                                                                                                   |
| Solutions    | `/solutions`, `/solutions/[slug]`                                                                                                                 |
| Work         | `/portfolio`, `/portfolio/[slug]`, `/case-studies`, `/case-studies/[slug]`                                                                        |
| Training     | `/training`, `/training/courses`, `/training/courses/[slug]`, `/training/workshops`, `/training/corporate-training`, `/training/request-training` |
| Events       | `/events`, `/events/[slug]`                                                                                                                       |
| Blog         | `/blog`, `/blog/[slug]`, `/blog/category/[slug]`                                                                                                  |
| Information  | `/resources`, `/testimonials`, `/faq`                                                                                                             |
| Inquiries    | `/contact`, `/request-proposal`, `/book-consultation`                                                                                             |
| Legal drafts | `/privacy`, `/terms`, `/cookies`, `/accessibility`                                                                                                |
| Metadata     | `/sitemap.xml`, `/robots.txt`                                                                                                                     |

Service slugs: `software-development`, `web-application-development`, `ai-agents`, `workflow-consulting`, `digital-marketing`, `ai-video`, `social-media-growth`, `technology-consulting`, `application-modernization`, `training`.

Solution slugs: `startups`, `enterprises`, `professionals`, `students`, `educational-institutions`, `manufacturing`.

Detail routes derive from local data through `generateStaticParams`; unknown slugs show the custom 404. [src/lib/routes.ts](src/lib/routes.ts) provides the sitemap inventory. Canonical/social URLs use the local `site.url`. Indexing is intentionally disabled for this learning sample; robots rules are not access control.

## Customize Content

- Start with [src/data/site.ts](src/data/site.ts) for identity, title, availability, expertise, process, local URL, and email. Replace `REPLACE_WITH_YOUR_EMAIL@example.com` with an address you control before real contact.
- Add verified social URLs in [src/data/navigation.ts](src/data/navigation.ts). Missing URLs are non-link placeholders.
- Update verified employment, education, certification, speaking, and permission-based feedback in [src/data/profile.ts](src/data/profile.ts). Do not invent dates, qualifications, achievements, or endorsements.
- Edit hero focus copy and service-group introductions in [src/data/home.ts](src/data/home.ts). The service explorer receives a small projection of the existing service data.
- Add a service in [src/data/services.ts](src/data/services.ts), with a unique slug, existing category, audience, capabilities, challenges, deliverables, and tags. Detail routes, service choices, and sitemap derive from the data. Add new categories to the home service groups if needed.
- Add a solution in [src/data/solutions.ts](src/data/solutions.ts); related service slugs must exist.
- Add a project in [src/data/portfolio.ts](src/data/portfolio.ts). Retain its Concept Project, Learning Project, UI Prototype, or Personal Project label. Add only verified outcomes. Case studies belong in [src/data/caseStudies.ts](src/data/caseStudies.ts), with clear hypothetical disclosures.
- Add an article in [src/data/blogPosts.ts](src/data/blogPosts.ts), including slug, category, tags, author, dates, and structured sections. Paragraphs, bullets, code, and callouts are supported. Reading time and related articles are derived locally.
- Add a course in [src/data/courses.ts](src/data/courses.ts), with prerequisites, objectives, curriculum, resources, and FAQs. Add events in [src/data/events.ts](src/data/events.ts); leave dates and availability unverified until confirmed.
- Add resources in [src/data/resources.ts](src/data/resources.ts). Use a real local file in `public/documents` or retain Coming Soon. Never link a download that does not exist.

Repeated domain content lives in typed data modules. Unique page introductions remain colocated with their pages. Run typecheck/build after changing content or slugs and manually check related links and filters.

## Forms And Mailto

The four inquiry forms use [src/data/forms.ts](src/data/forms.ts), [src/components/forms/inquiry-form.tsx](src/components/forms/inquiry-form.tsx), and [src/lib/mailto.ts](src/lib/mailto.ts).

Validation is entirely local, including required fields, email/URL constraints, positive whole participant counts, and privacy acknowledgment. Errors are associated with controls; focus moves to the first invalid field. Optional details use a native disclosure. Country/time-zone fields support worldwide input, and budgets ask for currency.

Valid input produces a form-specific subject and complete body. Values are trimmed; subject line breaks are removed; recipient, subject, and body are encoded. All configured fields appear, with `Not provided` for empty optional values. The browser is asked to open a mailto URL. It cannot prove an email app opened or a message was delivered. Users must review and send manually. Consultation dates are preferences, never confirmed bookings.

Copy email address, Copy inquiry details, Open email application, a selectable complete summary, and a blank-email link provide fallbacks. Long mailto URLs may be rejected or truncated; copy the summary instead. Clipboard denial produces manual-copy guidance rather than false success. Clipboard writes occur only after explicit actions.

No form values are saved by the application to localStorage, sessionStorage, cookies, a database, or a server. The summary stays in component memory and clears when a field changes. Browser autofill, OS clipboard history, and email drafts are outside this application's control. Use fictitious input during learning and never enter secrets or confidential records.

## Theme And Assets

[src/app/globals.css](src/app/globals.css) contains foundational layout/control styles. [src/app/experience.css](src/app/experience.css) layers the redesigned visual system and responsive interactive-section styles. Both are imported by [src/app/layout.tsx](src/app/layout.tsx). Theme tokens include background, foreground, primary, secondary, accent, muted, border, card, success, warning, error, and highlight. Only `pg-theme` is persisted; system mode follows the OS.

Replace images under `public/images` with assets you own or may use. Update data paths, meaningful alt text, and dimensions together. Preserve aspect ratios and never imply abstract placeholders are real project screenshots. Manrope is bundled locally under the SIL Open Font License in [public/fonts/OFL.txt](public/fonts/OFL.txt). No remote font or image host is required at runtime.

## Troubleshooting

- If the chosen port is occupied, use `npx next dev --port 3001`.
- If route types are missing, `npm run typecheck` generates them first.
- Configure a default email application or copy the inquiry manually if mailto does nothing.
- Use localhost or HTTPS for clipboard access; manually select the summary if access is blocked.
- If browser storage is blocked, theme persistence may be unavailable, but the UI still renders.
- If animations seem absent, check the operating-system reduced-motion preference. The site intentionally honors it.
- Rebuild before reviewing changes in production mode.
- For corporate certificate failures, use your organization's trusted CA setup. Do not disable TLS. On supported Node versions, `--use-system-ca` uses the OS trust store.

## Future Dynamic Application Possibilities

A separately scoped future version could add a Node.js backend, database, CMS/admin tools, authentication, consent-aware submissions, email delivery, training/event registration, calendar availability, and payments. None is implemented or configured here. Each requires an explicit security/privacy design, verified content, operational ownership, and its own validation strategy.
