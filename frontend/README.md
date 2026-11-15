# PraedicoAI Private Limited

A company website for PraedicoAI Private Limited, focused on applied AI, intelligent software, workflow design, and practical enablement.

## Run Locally

Use Node.js 20.9 or newer and npm. This workspace was developed with Node.js 22.16. Run the commands below from the `frontend` directory. Configure the SMTP values in the ignored `.env` file for contact-form delivery and password-reset emails. Vercel production uses `https://praedicoai.com` for canonical URLs and indexing unless `NEXT_PUBLIC_SITE_URL` overrides it.

```powershell
cd frontend
npm install
npm run dev
```

Open http://localhost:3000, or the free port printed by Next.js. To choose a port explicitly, use `npx next dev --port 3001`.

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

For production review, stop the dev server, run `npm run build`, then `npm run start`. Alternatively run `npx next start --port 3001` after building. No frontend automated tests are included. Use [MANUAL_TESTING_CHECKLIST.md](MANUAL_TESTING_CHECKLIST.md).

## Stack And Experience

Next.js App Router, React, strict TypeScript, Tailwind CSS, ESLint, Prettier, Nodemailer, Lucide React, limited Framer Motion, `next/image`, and `next/font/local`. Static pages use Server Components; navigation, filtering, theme controls, inquiries, account registration, and interactive home sections use small Client Components. `/api/contact` runs on the Node.js runtime to deliver contact inquiries through SMTP. The account modal proxies registration and sign-in requests to the TypeScript API in the repository's `backend` directory; `/api/auth/password-reset` sends expiring reset links using the existing SMTP settings. Set `BACKEND_API_URL` when the API is hosted somewhere other than `http://localhost:4000`.

The visual system uses white surfaces, dark ink typography, blue/cyan accents, and responsive section layouts. It includes a pointer-responsive abstract hero with focus tabs, a category-based service explorer, subtle scroll reveals, native FAQ disclosures, a mobile navigation dialog, light/dark/system themes, and visible keyboard focus. Cards also respond to keyboard focus. Tab controls support arrow keys, Home, and End. Reduced-motion preferences disable optional movement.

## Scope And Honest Content

The separate backend stores registered user details, password hashes, session records, categorized enquiry leads, and email-verification challenges in MongoDB. The account modal supports individual and business registration, sign-in, sign-out, and email-based password reset. The Admin portal requires a MongoDB session for an explicitly provisioned admin account and manages real lead records; the public Demo Center uses server-gated Gemini text previews and its analytics are admin-only. Demos stay disabled until a server-side Gemini key and explicit beta/live release status are configured. The category-specific forms at `/enquiry` verify email, capture consent, save records through the backend, and send team and confirmation emails when SMTP is configured. The legacy `/contact` form uses the same MongoDB-backed email verification before sending its inquiry; proposal and consultation forms prepare drafts in the visitor's email application. SMTP credentials, Gemini API key, and `AUTH_INTERNAL_SECRET` belong only in `.env` or deployment secrets; do not expose them through `NEXT_PUBLIC_` variables. The backend includes a Docker Compose file for local MongoDB development; production hosting and CI/CD are not configured.

The site presents PraedicoAI as focused on applied AI, intelligent software, and workflow design. Portfolio and case-study entries are illustrative concepts, not client engagements or measured results. Program outlines and event examples are proposed, not confirmed schedules or accredited programs. No testimonials or certifications are published without verification. Interactive demos call Gemini only after the backend key and release gate are configured; demo prompts and responses are not persisted by PraedicoAI. Contact inquiries are emailed to the configured recipient; categorized enquiries are stored in the lead database. Images are abstract illustrations, not customer evidence. Legal pages are drafts requiring review against actual company operations.

## Structure

Paths below are relative to the `frontend` directory.

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
		portals/       Admin lead workspace and static Demo portal
		sections/      Heroes, interactive services, catalogs, detail layouts
		ui/            Buttons, alerts, FAQs, filters, empty states, motion
	data/            Typed local content and field definitions
	hooks/           Theme preference behavior
	lib/             Mailto, filtering, formatting, metadata, route inventory
	types/           Content and inquiry contracts
```

## Routes

| Area         | Paths                                                                                         |
| ------------ | --------------------------------------------------------------------------------------------- |
| Home         | `/`                                                                                           |
| About        | `/about`, `/about/experience`, `/about/education`, `/about/certifications`, `/about/speaking` |
| Services     | `/services`, `/services/[slug]`                                                               |
| Solutions    | `/solutions`, `/solutions/[slug]`                                                             |
| Work         | `/portfolio`, `/portfolio/[slug]`, `/case-studies`, `/case-studies/[slug]`                    |
| Programs     | `/programs`, `/programs/[sector]`, `/programs/[sector]/[subject]`                             |
| Events       | `/events`, `/events/[slug]`                                                                   |
| Blog         | `/blog`, `/blog/[slug]`, `/blog/category/[slug]`                                              |
| Information  | `/resources`, `/testimonials`, `/faq`                                                         |
| Inquiries    | `/enquiry`, `/enquiry/[category]`, `/contact`, `/request-proposal`, `/book-consultation`      |
| Accounts     | `/register`                                                                                   |
| Portals      | `/admin/login`, `/admin/dashboard`, `/admin/demos`, `/admin/reports`, `/admin/team`, `/admin/employees`, `/admin/employees/me`, `/admin/projects`, `/admin/content`, `/demo/login`, `/demo/dashboard` |
| Legal drafts | `/privacy`, `/terms`, `/cookies`, `/accessibility`                                            |
| Publishing   | `/updates`, `/updates/[slug]`                                                                  |
| Metadata     | `/sitemap.xml`, `/robots.txt`                                                                 |

Service slugs: `software-development`, `web-application-development`, `ai-agents`, `workflow-consulting`, `digital-marketing`, `ai-video`, `social-media-growth`, `technology-consulting`, `application-modernization`.

Solution slugs: `startups`, `enterprises`, `professionals`, `students`, `educational-institutions`, `manufacturing`.

Detail routes derive from local data through `generateStaticParams`; unknown slugs show the custom 404. [src/lib/routes.ts](src/lib/routes.ts) provides the sitemap inventory and omits noindex enquiry funnels. Canonicals and social metadata use `NEXT_PUBLIC_SITE_URL` when set; otherwise Vercel production uses `https://praedicoai.com`, while local development uses localhost and prevents indexing. [src/data/seo-pages.ts](src/data/seo-pages.ts) holds reusable metadata overrides for high-intent landing pages. Robots rules are not access control.

## Customize Content

- Set `NEXT_PUBLIC_SITE_URL` to the verified HTTPS production origin if it differs from `https://praedicoai.com`. Optionally set `NEXT_PUBLIC_CONTACT_EMAIL` for manual email fallbacks and `NEXT_PUBLIC_WHATSAPP_NUMBER` in international digits-only format to show WhatsApp contact links. These values are public and included in the client bundle; never use `NEXT_PUBLIC_` variables for secrets.
- The main navigation links to `/admin/login` and `/demo/login` by default. To point them at separately deployed portal applications, set `NEXT_PUBLIC_ADMIN_PORTAL_URL` and/or `NEXT_PUBLIC_DEMO_PORTAL_URL` to the intended public URLs before building/deploying. These are public destinations, not secrets.
- The Demo portal uses server-only `DEMO_PORTAL_EMAIL`, `DEMO_PORTAL_PASSWORD`, and `PORTAL_SESSION_SECRET`. Admin sign-in uses backend MongoDB authentication and routes users according to their permissions. To bootstrap access, register the intended account, set `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_SETUP_CONFIRMATION=CREATE_INITIAL_SUPER_ADMIN` in the backend environment, then run `npm run superadmin:setup` from the backend directory. This is a one-time command and refuses to run after a Super Admin exists. Super Admins manage account roles, custom permissions, and activation at `/admin/team`. The employee directory and projects are available at `/admin/employees` and `/admin/projects`; employees can view their own read-only work profile and assigned projects. Workforce records exclude salary, health, identity, and other sensitive personal data. Legacy account provisioning uses `npm run admin:grant -- admin@example.com`; `npm run team:grant -- teammate@example.com` only enables lead assignment. These operator commands require database access and must never be exposed publicly. Set `AUTH_INTERNAL_SECRET` to the same random value in the frontend and backend environments. Keep credentials and secrets in `.env` or deployment secrets; never add them to `NEXT_PUBLIC_` variables or commit them.
- Content Managers can create drafts and submit them for review at `/admin/content`; only accounts with the `content:publish` permission can publish/archive. Public pages live at `/updates` and `/updates/[slug]`. Draft/review content is never included in public reads or the sitemap. Core homepage and service pages remain code-managed. Configure server-side `BACKEND_API_URL` in Vercel to point to the deployed backend; the updates pages report backend/configuration errors rather than silently presenting incomplete content.
- Gemini demo execution is configured only in the backend environment: `GEMINI_API_KEY`, `GEMINI_MODEL`, and `GEMINI_DEMO_RELEASE_STATUS`. Release status defaults to `coming-soon`; use `beta` only after a real provider request succeeds and `live` only after end-to-end testing. The country gate depends on trusted Vercel country metadata and fails closed in production when missing; unpaid demos are blocked in the EEA, UK, and Switzerland. Google's unpaid tier may review and use prompts and outputs to improve its services. Users must be 18+ and must not enter personal, confidential, or sensitive information. Review current model availability, quota, and provider terms before enabling.
- Copy the SMTP variable names from `.env.example` into `.env` for local development, or configure them as server-only deployment variables. Set `AUTH_INTERNAL_SECRET` to the same random value in both frontend and backend environments; it must be at least 32 characters. `SMTP_PASSWORD` must be a Gmail app password for the configured account (with 2-Step Verification enabled), not its normal login password. Port 587 uses STARTTLS; the server strips spaces from the app password before authentication. Never commit `.env` or expose SMTP variables with a `NEXT_PUBLIC_` prefix.
- Start with [src/data/site.ts](src/data/site.ts) for identity, title, expertise, process, and the local fallback URL.
- Add or revise high-intent page titles and descriptions in [src/data/seo-pages.ts](src/data/seo-pages.ts); page-level canonical, Open Graph, and Twitter metadata are generated by [src/lib/metadata.ts](src/lib/metadata.ts).
- Add verified social URLs in [src/data/navigation.ts](src/data/navigation.ts). Social profiles without verified URLs are omitted from the public interface.
- Add verified speaking details and permission-based customer feedback in [src/data/profile.ts](src/data/profile.ts). Do not invent dates, qualifications, achievements, or endorsements.
- Edit hero focus copy and service-group introductions in [src/data/home.ts](src/data/home.ts). The service explorer receives a small projection of the existing service data.
- Add a service in [src/data/services.ts](src/data/services.ts), with a unique slug, existing category, audience, capabilities, challenges, deliverables, and tags. Detail routes, service choices, and sitemap derive from the data. Add new categories to the home service groups if needed.
- Add a solution in [src/data/solutions.ts](src/data/solutions.ts); related service slugs must exist.
- Add a project in [src/data/portfolio.ts](src/data/portfolio.ts). Label concepts and prototypes clearly; include only verified outcomes. Case studies belong in [src/data/caseStudies.ts](src/data/caseStudies.ts), with clear illustrative disclosures.
- Add an article in [src/data/blogPosts.ts](src/data/blogPosts.ts), including slug, category, tags, author, dates, and structured sections. Paragraphs, bullets, code, and callouts are supported. Reading time and related articles are derived locally.
- Add a sector or subject in [src/data/sectors.ts](src/data/sectors.ts); sector and subject routes derive from this data. Add events in [src/data/events.ts](src/data/events.ts); leave dates and availability unverified until confirmed.
- Add resources in [src/data/resources.ts](src/data/resources.ts). Use a real local file in `public/documents`; never link a download that does not exist.

Repeated domain content lives in typed data modules. Unique page introductions remain colocated with their pages. Run typecheck/build after changing content or slugs and manually check related links and filters.

## Forms And Email Delivery

The nine categorized lead forms are defined by [src/data/lead-categories.ts](src/data/lead-categories.ts) and rendered by [src/components/forms/lead-enquiry-form.tsx](src/components/forms/lead-enquiry-form.tsx). Student, professional, business, internship, corporate training, and institutional submissions use the verified-email flow, explicit consent, server-side category validation, and MongoDB persistence. [src/app/api/leads/route.ts](src/app/api/leads/route.ts) saves the enquiry through the backend and sends team and confirmation emails using the configured SMTP service; SMTP acceptance does not guarantee inbox delivery. Admin-only filters, assignment, status history, notes, follow-ups, analytics, and CSV export are implemented through the protected `/api/admin/leads` proxies. Backend schema, access control, and data mapping live under `backend/src/modules/leads`.

Contact form validation runs in the browser and again on the server, with same-origin checks, request-size limits, and basic per-process rate limits. OTP challenges are held temporarily in process memory, are removed when used or expired, and are lost on restart. The three OTP configuration variables must be positive whole numbers; invalid values make verification unavailable and are reported in server logs. This implementation is suitable for a single app instance only; multiple instances or serverless deployments need shared durable storage to ensure OTP verification works consistently. Proposal and consultation forms remain browser-only mailto drafts. Form errors are associated with controls; focus moves to the first invalid field. Optional details use a native disclosure. Country/time-zone fields support worldwide input, and budgets ask for currency.

Only after successful email verification and valid consent does a category-specific form save its lead and attempt both team and confirmation emails. Submission remains recorded if SMTP delivery is unavailable, and the response states that condition. The legacy contact form emails the configured `MAIL_TO`; proposal and consultation forms prepare a message in the browser and cannot confirm delivery. Consultation dates are preferences, never confirmed bookings.

Copy inquiry details is available as a fallback. Manual mailto options for proposal and consultation forms are shown only when `NEXT_PUBLIC_CONTACT_EMAIL` is set. Clipboard denial produces manual-copy guidance rather than false success. Clipboard writes occur only after explicit actions.

Category-specific enquiries are stored in MongoDB with consent time, workflow status, status history, optional assignee, follow-up, and admin notes. Admin and team access must be provisioned by an authorized operator. Email OTP challenges and rate-limit counters use process-local memory, so a shared store is required before deploying multiple or serverless instances. Contact details are also sent through the configured SMTP provider and recipient mailbox, which may retain them under their own policies. Do not submit secrets, confidential records, or sensitive personal information.

## Theme And Assets

[src/app/globals.css](src/app/globals.css) contains foundational layout/control styles. [src/app/experience.css](src/app/experience.css) layers the redesigned visual system and responsive interactive-section styles. Both are imported by [src/app/layout.tsx](src/app/layout.tsx). Theme tokens include background, foreground, primary, secondary, accent, muted, border, card, success, warning, error, and highlight. Only `pg-theme` is persisted; system mode follows the OS.

Replace images under `public/images` with assets you own or may use. Update data paths, meaningful alt text, and dimensions together. Preserve aspect ratios and never imply abstract placeholders are real project screenshots. Manrope is bundled locally under the SIL Open Font License in [public/fonts/OFL.txt](public/fonts/OFL.txt). No remote font or image host is required at runtime.

## Troubleshooting

- If the chosen port is occupied, use `npx next dev --port 3001`.
- If route types are missing, `npm run typecheck` generates them first.
- If contact delivery fails, confirm SMTP settings and Gmail app-password access in `.env` or the deployment environment, then restart/redeploy the app.
- Configure a default email application or copy the inquiry manually for proposal or consultation forms if mailto does nothing.
- Use localhost or HTTPS for clipboard access; manually select the summary if access is blocked.
- If browser storage is blocked, theme persistence may be unavailable, but the UI still renders.
- If animations seem absent, check the operating-system reduced-motion preference. The site intentionally honors it.
- Rebuild before reviewing changes in production mode.
- For corporate certificate failures, use your organization's trusted CA setup. Do not disable TLS. On supported Node versions, `--use-system-ca` uses the OS trust store.

## Future Dynamic Application Possibilities

Full-site CMS editing beyond the limited updates workflow, event registration, calendar availability, and payments require separate security/privacy design, verified content, operational ownership, and validation.
