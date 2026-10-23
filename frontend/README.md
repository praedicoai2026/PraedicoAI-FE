# PraedicoAI Services Private Limited

A company website for PraedicoAI Services Private Limited, focused on applied AI, intelligent software, workflow design, and practical enablement.

## Run Locally

Use Node.js 20.9 or newer and npm. This workspace was developed with Node.js 22.16. Run the commands below from the `frontend` directory. Configure the SMTP values in the ignored `.env` file for contact-form delivery and password-reset emails. Set `NEXT_PUBLIC_SITE_URL` for production canonical URLs and indexing.

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

The separate backend stores registered user details, password hashes, and session records in MongoDB. The account modal supports individual and business registration, sign-in, sign-out, and email-based password reset. Password reset uses the existing SMTP settings; the one-time link expires after 30 minutes. Account access does not confirm course enrollment or scheduling. The Admin and Demo portals remain front-end prototypes with static sample data and separate browser-session-only navigation markers; they do not provide access control or connect to registered users or real projects. The `/contact` form sends inquiries through a server-side Next.js route and the configured SMTP account. Proposal and consultation forms prepare drafts in the visitor's email application. Program enquiries use the contact form. SMTP credentials and `AUTH_INTERNAL_SECRET` belong only in `.env` or deployment secrets; do not expose them through `NEXT_PUBLIC_` variables. The backend includes a Docker Compose file for local MongoDB development; production hosting and CI/CD are not configured.

The site presents PraedicoAI as focused on applied AI, intelligent software, and workflow design. Portfolio and case-study entries are illustrative concepts, not client engagements or measured results. Program outlines and event examples are proposed, not confirmed schedules or accredited programs. No testimonials or certifications are published without verification. The website does not run an AI model. Contact inquiries are emailed to the configured recipient; the app does not save them in a database. Images are abstract illustrations, not customer evidence. Legal pages are drafts requiring review against actual company operations.

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
		portals/       Static Admin and Demo portal experiences
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
| Inquiries    | `/contact`, `/request-proposal`, `/book-consultation`                                         |
| Accounts     | `/register`                                                                                   |
| Portals      | `/admin/login`, `/admin/dashboard`, `/demo/login`, `/demo/dashboard`                          |
| Legal drafts | `/privacy`, `/terms`, `/cookies`, `/accessibility`                                            |
| Metadata     | `/sitemap.xml`, `/robots.txt`                                                                 |

Service slugs: `software-development`, `web-application-development`, `ai-agents`, `workflow-consulting`, `digital-marketing`, `ai-video`, `social-media-growth`, `technology-consulting`, `application-modernization`.

Solution slugs: `startups`, `enterprises`, `professionals`, `students`, `educational-institutions`, `manufacturing`.

Detail routes derive from local data through `generateStaticParams`; unknown slugs show the custom 404. [src/lib/routes.ts](src/lib/routes.ts) provides the sitemap inventory. Canonical/social URLs use `NEXT_PUBLIC_SITE_URL`; when it is unset, local development uses localhost, robots and metadata prevent indexing, and article share links are withheld. Robots rules are not access control.

## Customize Content

- Set `NEXT_PUBLIC_SITE_URL` to the verified HTTPS production origin in the deployment environment before launch. Optionally set `NEXT_PUBLIC_CONTACT_EMAIL` for manual email fallbacks on proposal and consultation forms. Both values are public and included in the client bundle; never use `NEXT_PUBLIC_` variables for secrets.
- The main navigation links to `/admin/login` and `/demo/login` by default. To point them at separately deployed portal applications, set `NEXT_PUBLIC_ADMIN_PORTAL_URL` and/or `NEXT_PUBLIC_DEMO_PORTAL_URL` to the intended public URLs before building/deploying. These are public destinations, not secrets.
- Admin and Demo sign-in validate `ADMIN_PORTAL_EMAIL`, `ADMIN_PORTAL_PASSWORD`, `DEMO_PORTAL_EMAIL`, and `DEMO_PORTAL_PASSWORD` on the server. A separate signed, HTTP-only session cookie is issued for each portal; dashboard pages also validate their session server-side. Set `PORTAL_SESSION_SECRET` to a unique random value of at least 32 characters. Keep all five values server-only in `.env` locally and deployment secrets in Vercel; never add them to `NEXT_PUBLIC_` variables or commit them. These static portals still do not connect to real users or business records. Before using for production administration, integrate a proper identity provider, rate limiting, role-based authorization, and protected APIs; the supplied simple passwords should be considered demo credentials and changed before any public deployment.
- Copy the SMTP variable names from `.env.example` into `.env` for local development, or configure them as server-only deployment variables. Set `AUTH_INTERNAL_SECRET` to the same random value in both frontend and backend environments; it must be at least 32 characters. `SMTP_PASSWORD` must be a Gmail app password for the configured account (with 2-Step Verification enabled), not its normal login password. Port 587 uses STARTTLS; the server strips spaces from the app password before authentication. Never commit `.env` or expose SMTP variables with a `NEXT_PUBLIC_` prefix.
- Start with [src/data/site.ts](src/data/site.ts) for identity, title, expertise, process, and the local fallback URL.
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

The three inquiry forms use [src/data/forms.ts](src/data/forms.ts), [src/components/forms/inquiry-form.tsx](src/components/forms/inquiry-form.tsx), and [src/lib/mailto.ts](src/lib/mailto.ts). The contact form first sends a six-digit email verification code using [src/app/api/contact/otp/route.ts](src/app/api/contact/otp/route.ts). Code expiry, verification attempts, and resend cooldown are configured using `OTP_EXPIRY_MINUTES`, `OTP_MAX_ATTEMPTS`, and `OTP_RESEND_COOLDOWN_SECONDS` (defaults: 10 minutes, 5 attempts, and 60 seconds). [src/app/api/contact/otp/verify/route.ts](src/app/api/contact/otp/verify/route.ts) verifies the code, and [src/app/api/contact/route.ts](src/app/api/contact/route.ts) independently requires the resulting one-time verification before sending any inquiry. The contact and verification emails are sent through SMTP. SMTP acceptance does not guarantee inbox delivery. The visitor's email is set as `Reply-To`.

Contact form validation runs in the browser and again on the server, with same-origin checks, request-size limits, and basic per-process rate limits. OTP challenges are held temporarily in process memory, are removed when used or expired, and are lost on restart. The three OTP configuration variables must be positive whole numbers; invalid values make verification unavailable and are reported in server logs. This implementation is suitable for a single app instance only; multiple instances or serverless deployments need shared durable storage to ensure OTP verification works consistently. Other inquiry forms remain browser-only mailto drafts. Form errors are associated with controls; focus moves to the first invalid field. Optional details use a native disclosure. Country/time-zone fields support worldwide input, and budgets ask for currency.

Only after successful verification does the contact form email the configured `MAIL_TO` address with all submitted fields and send a receipt confirmation to the verified address. The receipt includes the inquiry type and subject, not the full form details. The notification uses the visitor's address as `Reply-To`. If the notification succeeds but the receipt fails, the page reports that partial outcome accurately. Proposal and consultation forms prepare a message in the browser; they cannot confirm that an email app opened or a message was delivered. Program enquiries use the verified contact form. Consultation dates are preferences, never confirmed bookings.

Copy inquiry details is available as a fallback. Manual mailto options for proposal and consultation forms are shown only when `NEXT_PUBLIC_CONTACT_EMAIL` is set. Clipboard denial produces manual-copy guidance rather than false success. Clipboard writes occur only after explicit actions.

Inquiry submissions are not saved to localStorage, sessionStorage, cookies, or the application database. Contact details are sent to the SMTP provider and the configured recipient mailbox, which may retain them under their own policies. Registered account records are stored separately by the backend. Do not submit secrets, confidential records, or sensitive personal information.

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

The account-registration backend could be extended with sign-in, verified email, password reset, and authenticated sessions. CMS/admin tools, event registration, calendar availability, and payments require separate security/privacy design, verified content, operational ownership, and validation.
