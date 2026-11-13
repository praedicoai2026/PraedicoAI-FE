# PraedicoAI Backend

Node.js 22.13+ API built with strict TypeScript, Express 5, Mongoose, and MongoDB. The API provides user registration, versioned JSON endpoints, structured logging, request validation, security headers, rate limiting, and graceful shutdown.

## Local setup

1. Set `MONGODB_URI`, `DB_USER`, `DB_PASSWORD`, and `AUTH_INTERNAL_SECRET` in `.env`. `MONGODB_URI` supplies the MongoDB host/database, credentials are passed separately, and the internal secret must match the frontend value. Keep secrets local and never commit them.
2. Start the local database with Docker Compose: `docker compose up -d`.
3. Install dependencies: `npm install`.
4. Start the API: `npm run dev`.

The API listens on `http://localhost:4000`. The frontend proxies authentication requests to it; set `BACKEND_API_URL` in the frontend environment when the API is not at that address. Configure the same `AUTH_INTERNAL_SECRET` in the frontend and backend environments; the frontend uses it only for server-to-server password-reset email dispatch.

## Endpoints

| Method | Path                                  | Purpose                                     |
| ------ | ------------------------------------- | ------------------------------------------- |
| GET    | `/health/live`                        | Process liveness                            |
| GET    | `/health/ready`                       | Database readiness                          |
| POST   | `/api/v1/auth/register`               | Create an individual or business account    |
| POST   | `/api/v1/auth/login`                  | Sign in and set an HTTP-only session cookie |
| POST   | `/api/v1/auth/logout`                 | Revoke the current session                  |
| GET    | `/api/v1/auth/me`                     | Return the current signed-in user           |
| POST   | `/api/v1/auth/password-reset/request` | Internal-only reset-token request           |
| POST   | `/api/v1/auth/password-reset/confirm` | Set a new password using a one-time link    |

Registration collects contact details, account type, course category and course, password confirmation, and terms consent. Business accounts also require an organization name and description; website is optional. Emails are normalized to lowercase, password confirmation is checked, and passwords are bcrypt-hashed before persistence. Duplicate email addresses return `409`, and successful responses never include password hashes. Sessions use random, hashed server-side tokens in HTTP-only cookies. Password reset links expire after 30 minutes and can be used once. Registration and sign-in are limited per IP; limits use in-memory storage, so use a shared store when running multiple API instances and configure trusted reverse proxies explicitly before relying on client IPs.

## Commands

| Command             | Purpose                 |
| ------------------- | ----------------------- |
| `npm run dev`       | Run the API with reload |
| `npm run build`     | Compile TypeScript      |
| `npm start`         | Run the compiled API    |
| `npm run lint`      | Run ESLint              |
| `npm run typecheck` | Check TypeScript        |
| `npm test`          | Run API tests           |

In production, provide `MONGODB_URI`, `DB_USER`, `DB_PASSWORD`, `AUTH_INTERNAL_SECRET`, `FRONTEND_ORIGIN`, `NODE_ENV=production`, and the desired `PORT`/`LOG_LEVEL` through the deployment environment. Configure a managed MongoDB service and TLS for production; the Compose credentials are only for local development.
