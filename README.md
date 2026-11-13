# PraedicoAI

PraedicoAI is organized as two independent applications:

- [`frontend/`](./frontend/README.md) — the Next.js website and account access modal.
- [`backend/`](./backend/README.md) — the TypeScript/Express API and MongoDB user store.

## Start locally

Use Node.js 22.13 or newer for the backend and npm. The frontend requires Node.js 20.9 or newer. Start MongoDB (Docker Compose is provided), then open two terminals from the repository root:

```powershell
cd backend
if (!(Test-Path .env)) { Copy-Item .env.example .env }
npm install
docker compose up -d
npm run dev
```

```powershell
cd frontend
npm install
npm run dev
```

Open http://localhost:3000. The frontend proxies `/api/backend/*` requests to the API at `http://localhost:4000`; set `BACKEND_API_URL` in the frontend build environment when the API is hosted elsewhere. Configure both applications' environment variables using their respective `.env.example` files. Never commit `.env` files or expose backend secrets through `NEXT_PUBLIC_` variables.

Set `MONGODB_URI` in `backend/.env` to your MongoDB connection string. Keep credentials out of source control. See the application READMEs for architecture, commands, deployment configuration, and troubleshooting.
