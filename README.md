# Task & Time Tracking App

A full-stack web application for managing tasks and tracking time spent on them with a real-time timer, daily productivity summaries, and per-user data isolation.

> **Built as a full-stack engineering assignment.** Backend-focused architecture with secure JWT authentication, RESTful API design, and clean separation of concerns.

---

## 🔗 Live Demo

- **Frontend:** https://suntek-task-tracker.vercel.app
- **Backend API:** https://suntek-task-tracker-api.onrender.com
- **API Health Check:** https://suntek-task-tracker-api.onrender.com/health

### Test Credentials

You can sign up with any email/password, or use the demo account:

```
Email:    demo@suntek.app
Password: demo12345
```

> ⚠️ **First request may take 30–60 seconds.** The backend is hosted on Render's free tier, which spins down after inactivity. Subsequent requests are fast.

---

## ✨ Features

### Authentication
- Secure signup and login with bcrypt-hashed passwords
- JWT-based sessions stored in **httpOnly cookies** (XSS-resistant)
- Cross-domain cookie configuration (`SameSite=None`, `Secure`) for deployed frontend/backend
- All protected endpoints enforce user authorization — users can only access their own data

### Task Management
- Create, read, update, and delete tasks
- Three statuses: `PENDING`, `IN_PROGRESS`, `COMPLETED`
- Status auto-transitions to `IN_PROGRESS` when a timer starts
- Server-side input validation with Zod
- Per-user data isolation enforced at the query level

### Real-Time Time Tracking
- Start/Stop timer per task with one click
- Live-ticking elapsed display while a timer is running
- Each session stored as a `TimeLog` entry with `startTime`, `endTime`, and `durationSeconds`
- Running timers survive page reloads (the timer state lives in the database, not in browser memory)
- Total time per task aggregated across all sessions

### Daily Summary
- Current-day breakdown: tasks worked on, total time tracked, completed tasks, pending tasks
- Computed server-side from authoritative time-log data

---

## 🧱 Tech Stack

### Frontend
| Tech | Why |
|---|---|
| **Next.js 16** (App Router) | Modern React framework with SSR, file-based routing, and Vercel-native deployment |
| **TypeScript** | Type safety across the stack |
| **Tailwind CSS** | Utility-first styling, minimal bundle size |
| **Axios** | HTTP client with credentials support for cookie-based auth |
| **date-fns** | Date formatting and manipulation |

### Backend
| Tech | Why |
|---|---|
| **Node.js + Express** | Mature, well-understood server framework |
| **TypeScript** | Strict typing for safer refactors and clearer API contracts |
| **Prisma 7** | Type-safe ORM with migration support and clean schema definition |
| **PostgreSQL** (via Neon) | Relational DB with strong consistency guarantees, hosted serverless |
| **JWT** (`jsonwebtoken`) | Stateless authentication tokens |
| **bcrypt** | Password hashing |
| **Zod** | Runtime input validation with TypeScript inference |
| **cookie-parser** | Parses httpOnly cookies on incoming requests |

### Infrastructure
| Service | Purpose |
|---|---|
| **Vercel** | Frontend hosting (CDN + serverless functions) |
| **Render** (Singapore region) | Backend hosting (Node.js web service) |
| **Neon** | Managed PostgreSQL with connection pooling |

---

## 📐 Architecture & Design Decisions

### Separation of frontend and backend
The frontend (Next.js on Vercel) and backend (Express on Render) are deployed as independent services and communicate over HTTPS. This boundary mirrors how scalable products are built — the API can be consumed by a future mobile app or other clients without changes.

### JWT in httpOnly cookies (vs. localStorage)
Tokens are stored in **httpOnly cookies** rather than `localStorage`. This makes them inaccessible to JavaScript and immune to XSS-based token theft. In production, cookies use `SameSite=None; Secure` to allow cross-domain transmission between the Vercel frontend and Render backend.

### Timer state lives in the database
A running timer is represented by a `TimeLog` row with `endTime = NULL`. The frontend computes elapsed time from `startTime` to "now," ticking locally each second. This means:
- Timers survive page reloads (no client-side state to lose)
- A user could start a timer on their laptop and see it still running on their phone
- The server is the source of truth — no possibility of client-side clock drift corrupting data

### Per-user authorization enforced server-side
Every database query for tasks and time logs is scoped by `userId` from the authenticated JWT — never from a client-supplied parameter. This makes IDOR (Insecure Direct Object Reference) attacks impossible by design, not by convention.

### Database schema
Three tables with clean relationships:
```
User  ──< Task  ──< TimeLog
  └────────────────^
```
- A `User` has many `Task`s and many `TimeLog`s
- A `Task` belongs to a `User` and has many `TimeLog`s
- `onDelete: Cascade` everywhere — deleting a user removes their data atomically

Indexes on `userId` (and `userId + status` for filtered queries) keep "fetch this user's stuff" fast even as the table grows.

---

## 📁 Project Structure

```
suntek-task-tracker/
├── server/                       # Express + Prisma backend
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema (3 tables, 1 enum)
│   │   └── migrations/           # Migration history
│   ├── src/
│   │   ├── controllers/          # Route handlers (auth, tasks, time-logs, summary)
│   │   ├── routes/               # Express routers, one per domain
│   │   ├── middleware/           # `authenticate` JWT guard
│   │   ├── validators/           # Zod schemas
│   │   ├── lib/                  # Prisma client, JWT helpers
│   │   ├── app.ts                # Express app + CORS + middleware setup
│   │   └── server.ts             # Entry point, DB connection bootstrap
│   ├── .env.example
│   └── package.json
│
├── client/                       # Next.js frontend
│   ├── app/                      # App Router pages
│   │   ├── login/                # Login page
│   │   ├── signup/               # Signup page
│   │   ├── dashboard/            # Authenticated landing
│   │   ├── tasks/                # Task list and detail pages
│   │   └── summary/              # Daily summary view
│   ├── components/               # AppProvider, Navbar, TaskCard, TaskForm, TimerButton, SummaryCards
│   ├── lib/                      # auth context, axios client, types
│   └── package.json
│
└── README.md
```

---

## 🔌 API Reference

All endpoints (except auth) require a valid JWT in the `token` httpOnly cookie. Validation errors return `400`; unauthenticated requests return `401`; forbidden access returns `403`.

### Authentication

| Method | Endpoint | Description | Body |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Create account, set auth cookie | `{ email, password }` |
| `POST` | `/api/auth/login` | Authenticate, set auth cookie | `{ email, password }` |
| `POST` | `/api/auth/logout` | Clear auth cookie | — |
| `GET`  | `/api/auth/me` | Get current user | — |

### Tasks

| Method | Endpoint | Description | Body |
|---|---|---|---|
| `GET`    | `/api/tasks` | List user's tasks | — |
| `GET`    | `/api/tasks/:id` | Get one task (with time logs) | — |
| `POST`   | `/api/tasks` | Create task | `{ title, description?, status? }` |
| `PATCH`  | `/api/tasks/:id` | Update task | `{ title?, description?, status? }` |
| `DELETE` | `/api/tasks/:id` | Delete task | — |

### Time Logs

| Method | Endpoint | Description | Body |
|---|---|---|---|
| `POST`  | `/api/time-logs/start` | Start timer for a task | `{ taskId }` |
| `PATCH` | `/api/time-logs/:id/stop` | Stop a running timer | — |

### Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/summary/today` | Daily summary for current user |

---

## 🚀 Local Development

### Prerequisites
- Node.js 18+
- A PostgreSQL database (local or [Neon](https://neon.tech) free tier)
- npm

### 1. Clone the repository

```bash
git clone https://github.com/dhanubansal777/suntek-task-tracker.git
cd suntek-task-tracker
```

### 2. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` and fill in:

```bash
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
JWT_SECRET="a-long-random-string-at-least-32-chars"
NODE_ENV="development"
PORT=5000
FRONTEND_URL="http://localhost:3000"
```

Generate the Prisma client and create the database schema:

```bash
npx prisma generate
npx prisma db push
```

Start the dev server:

```bash
npm run dev
# → API running on http://localhost:5000
```

Health check: open http://localhost:5000/health — should return `{"status":"ok"}`.

### 3. Frontend setup

In a new terminal:

```bash
cd client
npm install
```

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

Start the dev server:

```bash
npm run dev
# → Frontend running on http://localhost:3000
```

Open http://localhost:3000 and sign up.

---

## 🚢 Deployment

This app is deployed across three free-tier services. The configuration mirrors what's described above:

| Layer | Provider | Notes |
|---|---|---|
| Database | [Neon](https://neon.tech) | Pooled connection enabled |
| Backend | [Render](https://render.com) | Singapore region. Build: `npm install --include=dev && npm run build`. Start: `npm start`. Root directory: `server`. |
| Frontend | [Vercel](https://vercel.com) | Auto-detected Next.js. Root directory: `client`. |

### Key environment variables in production

**Backend (Render):**
- `DATABASE_URL` — Neon pooled connection string
- `JWT_SECRET` — long random string (production-only, different from dev)
- `NODE_ENV=production`
- `PORT=5000`
- `FRONTEND_URL` — `https://suntek-task-tracker.vercel.app`

**Frontend (Vercel):**
- `NEXT_PUBLIC_API_URL` — `https://suntek-task-tracker-api.onrender.com/api`

---

## 🛣 Roadmap

Features I'd add given more time:

- [ ] **AI-assisted task creation** — Use Claude API to expand short prompts ("follow up with designer") into structured tasks with clearer titles and concrete descriptions
- [ ] **Weekly productivity chart** — Time tracked per day over the last 7 days
- [ ] **Task-time breakdown chart** — Pie chart of time spent per task this week
- [ ] **Keyboard shortcuts** — Space to start/stop the active task's timer
- [ ] **Idle detection** — Prompt to stop a timer that's been running for >X hours
- [ ] **Mobile-optimized PWA** — installable to home screen

---

## 📄 License

MIT
