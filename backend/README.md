# PraedicoAI Backend

Node.js 22.13+ API built with strict TypeScript, Express 5, Mongoose, and MongoDB. The API provides account authentication, categorized lead intake and administration, versioned JSON endpoints, structured logging, request validation, security headers, rate limiting, and graceful shutdown. `package-lock.json` uses lockfile version 3.

## Local setup

1. Set `MONGODB_URI`, `DB_USER`, `DB_PASSWORD`, and `AUTH_INTERNAL_SECRET` in `.env`. `MONGODB_URI` supplies the MongoDB host/database, credentials are passed separately, and the internal secret must match the frontend value. Keep secrets local and never commit them.
2. Start the local database with Docker Compose: `docker compose up -d`.
3. Install dependencies: `npm install`.
4. Start the API: `npm run dev`.

The API listens on `http://localhost:4000` locally. In production, it binds to `0.0.0.0` and uses the platform-provided `PORT`. The frontend proxies backend requests server-side; set its server-only `BACKEND_API_URL` to the deployed API URL. Configure the same `AUTH_INTERNAL_SECRET` in both environments; it is used only for server-to-server password-reset, lead, and demo requests.

## Endpoints

| Method | Path                                  | Purpose                                                |
| ------ | ------------------------------------- | ------------------------------------------------------ |
| GET    | `/health`                             | Process liveness for hosting-provider health checks    |
| GET    | `/health/live`                        | Process liveness                                       |
| GET    | `/health/ready`                       | Database readiness                                     |
| POST   | `/api/v1/auth/register`               | Create an individual or business account               |
| POST   | `/api/v1/auth/login`                  | Sign in and set an HTTP-only session cookie            |
| POST   | `/api/v1/auth/logout`                 | Revoke the current session                             |
| GET    | `/api/v1/auth/me`                     | Return the current signed-in user                      |
| POST   | `/api/v1/auth/password-reset/request` | Internal-only reset-token request                      |
| POST   | `/api/v1/auth/password-reset/confirm` | Set a new password using a one-time link               |
| POST   | `/api/v1/leads`                       | Internal-only validated lead submission                |
| GET    | `/api/v1/leads/admin`                 | Admin-only filtered and paginated lead list            |
| PATCH  | `/api/v1/leads/admin/:id`             | Admin-only status, assignment, note, follow-up updates |
| GET    | `/api/v1/leads/admin/analytics`       | Admin-only lead counts                                 |
| GET    | `/api/v1/leads/admin/team`            | Admin-only authorized assignees                        |
| GET    | `/api/v1/leads/admin/export.csv`      | Admin-only CSV export (maximum 10,000 rows)            |
| GET    | `/api/v1/demos/status`                | Public availability status, gated by region            |
| POST   | `/api/v1/demos/execute`               | Internal-only bounded Gemini demo execution            |
| POST   | `/api/v1/demos/track`                 | Internal-only aggregate demo event tracking            |
| GET    | `/api/v1/demos/admin/analytics`       | Admin-only aggregated demo usage and lead conversions  |
| GET    | `/api/v1/admin/accounts`              | Super Admin-only filtered administrator account list   |
| PATCH  | `/api/v1/admin/accounts/:id`          | Super Admin-only role, permission, and account updates |
| GET    | `/api/v1/employees`                   | Employee directory for authorized managers             |
| GET    | `/api/v1/employees/me`                | Read-only profile for the signed-in employee           |
| POST   | `/api/v1/employees/profiles`          | Create or update an employee work profile              |
| PATCH  | `/api/v1/employees/profiles/:userId`  | Update employee department, title, manager, or status  |
| GET    | `/api/v1/employees/reports`           | Department and project status aggregates               |
| GET    | `/api/v1/projects`                    | Project list, scoped to employee assignments           |
| POST   | `/api/v1/projects`                    | Create a project and assign eligible accounts          |
| PATCH  | `/api/v1/projects/:projectId`         | Update project status, owner, dates, or members        |
| GET    | `/api/v1/reports/dashboard`           | Unified persisted workspace metrics                    |
| GET    | `/api/v1/content/admin`               | Content Manager/administrator editorial queue          |
| POST   | `/api/v1/content/admin`               | Create a content draft or review entry                 |
| PATCH  | `/api/v1/content/admin/:id`           | Update content and workflow status                     |
| GET    | `/api/v1/content/public`              | List published content only                            |
| GET    | `/api/v1/content/public/:slug`        | Fetch one published content page                       |

Registration collects contact details, account type, course category and course, password confirmation, and terms consent. Business accounts also require an organization name and description; website is optional. Emails are normalized to lowercase, password confirmation is checked, and passwords are bcrypt-hashed before persistence. Duplicate email addresses return `409`, and successful responses never include password hashes. Sessions use random, hashed server-side tokens in HTTP-only cookies. Password reset links expire after 30 minutes and can be used once. Registration and sign-in are limited per IP; limits use in-memory storage, so use a shared store when running multiple API instances and configure trusted reverse proxies explicitly before relying on client IPs.

New accounts receive the `member` role; public registration cannot submit or change roles. Existing accounts must be explicitly provisioned by an operator with access to the backend environment:

```powershell
npm run superadmin:setup
npm run admin:grant -- admin@example.com
npm run team:grant -- teammate@example.com
```

Before the one-time `superadmin:setup`, register the intended account and set `SUPER_ADMIN_EMAIL` plus `SUPER_ADMIN_SETUP_CONFIRMATION=CREATE_INITIAL_SUPER_ADMIN` in the backend environment. The command promotes only that existing account and refuses to run if a Super Admin already exists. The other commands require an existing account and MongoDB credentials: `admin:grant` enables the legacy Admin role, while `team:grant` makes an account eligible for lead assignment without granting admin access. Never expose these commands through a public endpoint.

Admin access is enforced by backend permissions on every protected route. Super Admins can manage accounts, roles, custom permissions, and activation; deactivation revokes existing sessions. Admin account changes are audited. Admins cannot grant or edit Super Admin access, and only a Super Admin can manage administrator accounts or settings. Training Managers are limited to `AI Learning` enquiries. Lead categories are validated on the server and mapped to the `AI Business Solutions` or `AI Learning` vertical. Enquiries require explicit consent and verified email via the frontend flow before persistence. Team assignments are limited to accounts granted the `staff` or `admin` role. Status changes are recorded in history; notes and follow-up dates are stored with each lead.

Workforce records are deliberately limited to work details: department, job title, manager, work status, and project assignment. Salary, health, identity, and other sensitive employee data are not collected. Employees can read their own profile and assigned projects; self-service profile edits are disabled. HR Managers manage the employee directory, Project Managers manage projects and view scoped work details, and role checks are repeated in the API. Directory and project responses use explicit user-field projections rather than exposing account documents.

The unified reports endpoint aggregates persisted leads, demo event metadata, employee profiles, and projects. Product and community metrics are counts of enquiries, not live products or launched programs. Demo usage aggregates are subject to the 180-day retention policy.

The content workflow covers articles, resources, events, and product/research/community updates without replacing code-managed core pages. Content Managers can create drafts and submit them for review; only users with `content:publish` can publish or archive. Public endpoints return published entries only, and the website renders saved content as plain text rather than injecting HTML. Research, product, community, and partnership interest is categorized in the existing CRM; demo conversions remain attributed through their source path.

The public demo API can run short, text-only Gemini previews. It is disabled unless `GEMINI_API_KEY` is configured and `GEMINI_DEMO_RELEASE_STATUS` is explicitly set to `beta` or `live`; keep the key server-side. The unpaid-tier frontend and backend gates require a trusted country code and reject EEA, UK, and Swiss requests. Configure the frontend and backend only behind a deployment that supplies a trustworthy country header. Limits are five executions per 15 minutes per pseudonymous client key, 2,000 input characters, and 600 output tokens by default. Usage records contain event metadata but never prompt or response text and expire after 180 days. Google's unpaid-tier terms allow review and use of inputs and outputs to improve its services; demo users must be 18+ and must not enter personal, sensitive, or confidential information. Confirm current model availability and terms in the provider account before enabling beta; perform a real provider smoke test before setting `live`.

## Commands

| Command                          | Purpose                                                  |
| -------------------------------- | -------------------------------------------------------- |
| `npm run dev`                    | Run the API with reload                                  |
| `npm run admin:grant -- <email>` | Grant admin access to an existing account                |
| `npm run superadmin:setup`       | One-time setup of the initial Super Admin account        |
| `npm run team:grant -- <email>`  | Grant team-assignment eligibility to an existing account |
| `npm run build`                  | Compile TypeScript                                       |
| `npm start`                      | Run the compiled API                                     |
| `npm run lint`                   | Run ESLint                                               |
| `npm run typecheck`              | Check TypeScript                                         |
| `npm test`                       | Run API tests                                            |

In production, provide `MONGODB_URI`, `DB_USER`, `DB_PASSWORD`, `AUTH_INTERNAL_SECRET`, `NODE_ENV=production`, and a correct `FRONTEND_ORIGINS` allowlist through the deployment environment. Render supplies `PORT`; `LOG_LEVEL` is optional. Configure a managed MongoDB service and TLS for production; the Compose credentials are only for local development. Email OTP challenges, resend cooldowns, verification attempts, and claims are stored in MongoDB and shared across backend instances. HTTP rate-limit counters remain process-local.

## Render deployment

The repository-root `render.yaml` defines a Render Node Web Service using `backend/` as its root, Node `npm ci --include=dev && npm run build && npm prune --omit=dev` as its build command, `npm start` as its start command, and `/health` as its health check. Automatic deploys are disabled in the blueprint so a Git push does not deploy without an explicit action. It selects Render's Free plan to avoid choosing a paid service; free instances can spin down when idle and are not suitable where consistent production latency/availability is required. Select a paid plan only after reviewing its cost. Region is not pinned in the blueprint; Render's default is Oregon, so choose a closer supported region if appropriate when creating the service.

Render's Dashboard can use the blueprint after it is committed to the GitHub repository and pushed. If configuring a Web Service manually, use:

| Setting           | Value                                                           |
| ----------------- | --------------------------------------------------------------- |
| Repository        | `praedicoai2026/PraedicoAI-FE`                                  |
| Branch            | `main`                                                          |
| Runtime           | Node                                                            |
| Root Directory    | `backend`                                                       |
| Build Command     | `npm ci --include=dev && npm run build && npm prune --omit=dev` |
| Start Command     | `npm start`                                                     |
| Health Check Path | `/health`                                                       |
| Auto-Deploy       | Off until explicitly enabled                                    |

Set the environment variables below in Render. Do not copy production credentials from local `.env` files; the Blueprint marks database and internal-secret values as unsynchronized so they must be entered as Render secrets.

| Variable                         | Purpose                                                                                       | Required?                                | Example format                                                                     |
| -------------------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------- |
| `NODE_ENV`                       | Enables production cookie and proxy behavior                                                  | Yes in Render                            | `production`                                                                       |
| `PORT`                           | HTTP listen port; Render provides it                                                          | Platform-provided                        | Integer, do not hardcode                                                           |
| `LOG_LEVEL`                      | Structured log verbosity                                                                      | Optional, defaults to `info`             | `info`                                                                             |
| `FRONTEND_ORIGINS`               | Exact comma-separated browser origins allowed by CORS                                         | Optional, but configure for production   | `https://praedicoai.com,http://localhost:3000`                                     |
| `FRONTEND_ORIGIN`                | Backward-compatible single additional CORS origin                                             | Optional                                 | `http://localhost:3000`                                                            |
| `MONGODB_URI`                    | MongoDB cluster and database URI; URI credentials are stripped by the current connection code | Required                                 | `mongodb+srv://cluster.example.mongodb.net/praedicoai?retryWrites=true&w=majority` |
| `DB_USER`                        | MongoDB database username passed separately to Mongoose                                       | Required                                 | Atlas database-user name                                                           |
| `DB_PASSWORD`                    | MongoDB database password passed separately to Mongoose                                       | Required                                 | Secret value                                                                       |
| `AUTH_INTERNAL_SECRET`           | Shared frontend/backend server-to-server authentication secret, at least 32 characters        | Required                                 | Random secret generated securely                                                   |
| `OTP_EXPIRY_MINUTES`             | Lifetime of a contact email verification code                                                 | Optional, defaults to `10`               | `10`                                                                               |
| `OTP_MAX_ATTEMPTS`               | Maximum incorrect codes accepted per challenge                                                | Optional, defaults to `5`                | `5`                                                                                |
| `OTP_RESEND_COOLDOWN_SECONDS`    | Minimum time between codes sent to the same email address                                     | Optional, defaults to `60`               | `60`                                                                               |
| `GEMINI_API_KEY`                 | Server-side key for interactive Gemini demos                                                  | Optional; omit to keep demos disabled    | Provider key stored as a secret                                                    |
| `GEMINI_MODEL`                   | Gemini model name                                                                             | Optional, defaults to `gemini-3.8-flash` | `gemini-3.8-flash`                                                                 |
| `GEMINI_DEMO_RELEASE_STATUS`     | Demo release gate; defaults to `coming-soon`                                                  | Optional                                 | `coming-soon`, `beta`, or `live`                                                   |
| `DEMO_MAX_INPUT_CHARACTERS`      | Maximum demo input length                                                                     | Optional, defaults to `2000`             | Integer from `100` to `5000`                                                       |
| `DEMO_MAX_OUTPUT_TOKENS`         | Maximum Gemini response tokens                                                                | Optional, defaults to `600`              | Integer from `100` to `2000`                                                       |
| `SUPER_ADMIN_EMAIL`              | Target account for the one-time setup script only                                             | Setup only                               | Existing account email                                                             |
| `SUPER_ADMIN_SETUP_CONFIRMATION` | Explicit confirmation for the one-time setup script only                                      | Setup only                               | `CREATE_INITIAL_SUPER_ADMIN`                                                       |

`MONGODB_URI` must identify the target database but should not contain a username or password because `DB_USER` and `DB_PASSWORD` are supplied separately. In MongoDB Atlas, create a database user with only the required database permissions and allow the Render service's outbound IP addresses in Network Access. Prefer a supported static outbound IP option or another restricted network arrangement; do not make Atlas public to all IPs as a permanent workaround. Do not migrate, reset, or seed existing production collections as part of deployment.

The existing Vercel frontend uses the **server-only** `BACKEND_API_URL`, not `NEXT_PUBLIC_API_URL`. After creating the Render service, set `BACKEND_API_URL` in Vercel to the service's HTTPS `onrender.com` URL and set the same `AUTH_INTERNAL_SECRET` value used in Render. Redeploy the Vercel frontend after changing environment variables. Do not place `AUTH_INTERNAL_SECRET`, MongoDB credentials, or Gemini keys in any `NEXT_PUBLIC_` variable. The browser CORS allowlist includes the production origin and local development origin; add any other exact production/preview origin intentionally.

This repository contains no Python/FastAPI/Ollama client, upload route, or Python-service URL. Do not add a `PYTHON_AI_SERVICE_URL` unless that integration is added to this backend separately. The existing Gemini request has a 25-second timeout and returns a sanitized provider-unavailable error. The `/health` endpoint reports process liveness only; `/health/ready` checks MongoDB connectivity without revealing connection details.

For a local production-mode startup check, build and run with valid local/test environment values:

```powershell
npm ci
npm run build
npm start
Invoke-RestMethod http://localhost:4000/health
Invoke-RestMethod http://localhost:4000/health/ready
```

The checked-in `.env.example` is for local setup only. The root `.gitignore` excludes `.env` files while allowing `.env.example`; confirm secrets are not staged before committing.
