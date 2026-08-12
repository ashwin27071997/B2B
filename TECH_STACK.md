# Tech Stack Decisions

> **Status:** APPROVED
> **Created:** 2026-08-12
> **Decision Maker:** Soumik
> **Constraint:** FREE TIER only until revenue

---

## Executive Summary

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Frontend** | React 19 + Vite + TypeScript | Already in use, modern, fast |
| **Styling** | CSS Modules + CSS Variables | No runtime cost, themeable |
| **Auth** | Supabase Auth | Already integrated, free tier generous |
| **Database** | Supabase (Postgres) | Same platform as auth, RLS, real-time |
| **Backend** | Express + TypeScript | Full Node.js, no runtime limits |
| **File Storage** | Supabase Storage | 1GB free, integrated with RLS |
| **Hosting (Frontend)** | Vercel | Best DX, generous free tier |
| **Hosting (Backend)** | Fly.io | No sleep, 3 free VMs, Docker |
| **CI/CD** | GitHub Actions | Free, zero maintenance, production-grade |
| **Email** | Resend | 3K emails/mo free, best DX |
| **Monitoring** | Sentry (free tier) | Error tracking, 5K events/mo |
| **Background Jobs** | BullMQ + Upstash Redis | When needed, 10K commands/day free |

---

## Detailed Decisions

### 1. Database: Supabase Postgres

**Why Postgres over NoSQL:**
- Relational data (businesses, users, consultations) fits SQL naturally
- Strong typing with TypeScript generation
- ACID compliance for financial data
- Row Level Security for multi-tenancy

**Free Tier Limits:**
- 500 MB database size
- 2 GB bandwidth
- 50,000 monthly active users
- 500 MB file storage
- 2 million Edge Function invocations

**Schema Strategy:**
```
users (managed by Supabase Auth)
├── businesses (1:many)
│   ├── documents (1:many)
│   ├── consultations (1:many)
│   └── registrations (1:many)
└── profiles (1:1 extension of auth.users)
```

**When to Migrate:**
- If we exceed 500MB → Upgrade to Pro ($25/mo) or
- If we need read replicas → Consider PlanetScale/Neon

---

### 2. Backend: Express + TypeScript (Separate Repo)

**Architecture:**
```
┌─────────────────────────────────────────────────────────────────┐
│                         PRODUCTION                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────┐              ┌──────────────────────────┐    │
│   │   Frontend   │    HTTPS     │        Backend           │    │
│   │   (Vercel)   │ ──────────►  │       (Fly.io)           │    │
│   │              │              │                          │    │
│   │  React App   │              │  Express + TypeScript    │    │
│   │              │              │  ├── JWT verification    │    │
│   └──────────────┘              │  ├── Rate limiting       │    │
│                                 │  ├── Input validation    │    │
│                                 │  ├── Business logic      │    │
│                                 │  └── Supabase client     │    │
│                                 │                          │    │
│                                 └───────────┬──────────────┘    │
│                                             │                    │
│                                             ▼                    │
│                                 ┌──────────────────────────┐    │
│                                 │   Supabase (Postgres)    │    │
│                                 │   + Auth + Storage       │    │
│                                 └──────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Repository Structure:**
```
GitHub:
├── B2B/                      ← Frontend repo (this one)
│   ├── src/                  ← React app
│   ├── server/               ← Dev mock server (not for production)
│   └── Deploy to: Vercel
│
└── ledgerline-api/           ← Backend repo (to be created)
    ├── src/
    │   ├── routes/           ← API endpoints
    │   ├── services/         ← Business logic
    │   ├── middleware/       ← Auth, validation, logging
    │   ├── db/               ← Supabase client, queries
    │   └── utils/            ← Helpers
    ├── Dockerfile
    └── Deploy to: Fly.io
```

**Why Express on Fly.io (not Edge Functions):**

| Requirement | Edge Functions | Express + Fly.io |
|-------------|----------------|------------------|
| Complex business logic | Limited (10ms CPU) | Unlimited |
| Long-running tasks | No | Yes |
| Background jobs | No | Yes (with Redis) |
| Full Node.js ecosystem | No (Deno) | Yes |
| Learning value | Medium | High |
| Free tier | 2M invocations | 3 VMs, no sleep |
| DevOps experience | None | Docker basics |

**Backend Tech Choices:**
- **Express** - Familiar, huge ecosystem
- **TypeScript** - Type safety, better DX
- **Zod** - Runtime validation (already using)
- **Pino** - Structured logging (already using)
- **Supabase JS** - Database client
- **Helmet** - Security headers
- **CORS** - Cross-origin config

**The `server/` folder in this repo:**
- Stays as a **development mock server**
- Helps frontend development without backend
- **NOT deployed to production**
- In production, frontend calls Fly.io backend directly

---

### 3. Frontend Hosting: Vercel

**Why Vercel:**
- Zero-config deployment from GitHub
- Automatic preview deployments for PRs
- Edge network (fast globally)
- 100GB bandwidth free
- Excellent error messages

**Deployment Flow:**
```
git push → GitHub → Vercel auto-deploys
          ↓
    PR? → Preview URL
    main? → Production URL
```

**Configuration:**
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

---

### 4. Backend Hosting: Fly.io

**Why Fly.io:**
- 3 shared-cpu VMs free (256MB RAM each)
- No sleep on free tier (unlike Railway/Render)
- Docker-based deployment
- Global edge deployment when needed
- Simple CLI (`flyctl deploy`)

**Deployment Flow:**
```
git push → GitHub Actions → Build Docker → Deploy to Fly.io
```

**Dockerfile (for backend repo):**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 8080
CMD ["node", "dist/index.js"]
```

**fly.toml:**
```toml
app = "ledgerline-api"
primary_region = "bom"  # Mumbai

[build]

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = false  # Keep running
  auto_start_machines = true
  min_machines_running = 1

[env]
  NODE_ENV = "production"
```

---

### 7. CI/CD: GitHub Actions (Not Jenkins)

**Why GitHub Actions over Jenkins:**

| Aspect | Jenkins | GitHub Actions |
|--------|---------|----------------|
| Infrastructure | Requires dedicated server ($20-50/mo) | Free (included with GitHub) |
| Maintenance | You manage updates, plugins, security | Zero maintenance |
| Complexity | High (Groovy pipelines, plugins) | Low (YAML) |
| Free tier | No | 2,000 mins/mo for private repos |

**Production Features (All Free):**
- Automated tests on every PR
- Preview environments (Vercel auto-creates)
- Manual approval gates (GitHub Environments)
- Rollback capability
- Secrets management
- Audit trail

**CI/CD Pipeline Architecture:**
```
┌─────────────────────────────────────────────────────────────────┐
│                     GITHUB ACTIONS (FREE)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Push to feature branch                                         │
│         │                                                        │
│         ▼                                                        │
│   ┌─────────────┐                                                │
│   │   Lint      │──► Fail? → Block PR                            │
│   │   TypeCheck │                                                │
│   │   Test      │                                                │
│   └─────────────┘                                                │
│         │                                                        │
│         ▼                                                        │
│   ┌─────────────────────────────────────────────────────┐       │
│   │ FRONTEND (Vercel)        │ BACKEND (Fly.io)         │       │
│   │ Auto preview URL         │ Preview env (optional)   │       │
│   └─────────────────────────────────────────────────────┘       │
│         │                                                        │
│         ▼                                                        │
│   PR Merged to main                                              │
│         │                                                        │
│         ▼                                                        │
│   ┌─────────────────────────────────────────────────────┐       │
│   │ PRODUCTION DEPLOY                                    │       │
│   │ Frontend → Vercel (auto)                            │       │
│   │ Backend → Fly.io (via GitHub Actions)               │       │
│   └─────────────────────────────────────────────────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Frontend CI Workflow (.github/workflows/frontend-ci.yml):**
```yaml
name: Frontend CI

on:
  pull_request:
    paths:
      - 'src/**'
      - 'package.json'

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - run: npm ci
      - run: npm run lint
      - run: npm run build
      # - run: npm run test (when tests are added)
```

**Backend Deploy Workflow (.github/workflows/backend-deploy.yml):**
```yaml
name: Backend Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Fly.io
        uses: superfly/flyctl-actions/setup-flyctl@master

      - name: Deploy to Fly.io
        run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

**Full Backend CI/CD with Staging + Production (.github/workflows/backend-ci-cd.yml):**
```yaml
name: Backend CI/CD

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

env:
  FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

jobs:
  # Run on every PR
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm run test

  # Only deploy when merged to main
  deploy-staging:
    needs: quality
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only --app ledgerline-api-staging

  # Manual approval for production (via GitHub Environments)
  deploy-production:
    needs: deploy-staging
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production  # Requires manual approval in GitHub
    steps:
      - uses: actions/checkout@v4
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only --app ledgerline-api
```

**Setting Up Manual Approval (GitHub Environments):**
1. Go to repo → Settings → Environments
2. Create `staging` and `production` environments
3. For `production`, add:
   - Required reviewers (yourself or team)
   - Wait timer (optional, e.g., 10 min delay)
   - Branch restrictions (only `main`)

**Rollback Commands:**
```bash
# List recent deployments
flyctl releases list --app ledgerline-api

# Rollback to previous version
flyctl deploy --image registry.fly.io/ledgerline-api:v123 --app ledgerline-api
```

---

### 5. Email: Resend

**Why Resend over SendGrid/Mailgun:**
- 3,000 emails/month free (enough for early stage)
- Best developer experience
- React Email for templates
- Simple API

**Use Cases:**
- Consultation confirmations
- Business registration updates
- Password reset (handled by Supabase, but can customize)

---

### 5. Monitoring: Sentry

**Free Tier:**
- 5,000 errors/month
- 14-day retention
- 1 user

**What to Track:**
- Frontend errors (React Error Boundary integration)
- API failures
- Performance (Web Vitals)

---

## What We're NOT Using (and Why)

| Technology | Why Not |
|------------|---------|
| **Jenkins** | Requires dedicated server; GitHub Actions is free and sufficient |
| **Supabase Edge Functions** | Need full Node.js for complex backend logic |
| **Redis** | Premature; add with Upstash when background jobs needed |
| **Kubernetes** | Massive overkill; Fly.io handles orchestration |
| **GraphQL** | REST is simpler; no complex queries yet |
| **Next.js** | Already have Vite; SSR not needed |
| **tRPC** | Good, but adds complexity; REST + Zod is fine |
| **Prisma** | Supabase client is sufficient; less overhead |
| **Monorepo** | Premature; separate repos simpler for now |

---

## Cost Projection

### Phase 1: Free Tier (0-100 users)
| Service | Monthly Cost |
|---------|--------------|
| Supabase | $0 |
| Fly.io | $0 |
| Vercel | $0 |
| Resend | $0 |
| Sentry | $0 |
| **Total** | **$0** |

### Phase 2: Growth (100-1000 users)
| Service | Monthly Cost |
|---------|--------------|
| Supabase Pro | $25 |
| Fly.io | $0 (still free tier) |
| Vercel | $0 (still free tier) |
| Resend | $0 (still free tier) |
| Sentry | $0 |
| **Total** | **$25** |

### Phase 3: Scale (1000+ users)
| Service | Monthly Cost |
|---------|--------------|
| Supabase Pro | $25+ (usage-based) |
| Fly.io | ~$10 (more VMs) |
| Vercel Pro | $20 |
| Upstash Redis | $0 (free tier) or $10 |
| Resend | $20 |
| Sentry | $26 |
| **Total** | **~$100-120** |

---

## Migration Checklist

### Phase 1: Backend Setup
- [ ] Create `ledgerline-api` repository
- [ ] Set up Express + TypeScript boilerplate
- [ ] Add JWT verification middleware
- [ ] Add Zod validation
- [ ] Add Pino logging
- [ ] Create Dockerfile
- [ ] Deploy to Fly.io (staging)

### Phase 2: Database Setup
- [ ] Set up Supabase project (production)
- [ ] Create database schema with migrations
- [ ] Set up Row Level Security policies
- [ ] Connect backend to Supabase

### Phase 3: Frontend Production
- [ ] Set up Vercel project
- [ ] Configure environment variables
- [ ] Point frontend to Fly.io backend
- [ ] Set up custom domain

### Phase 4: Monitoring & Email
- [ ] Configure Sentry (frontend + backend)
- [ ] Set up Resend for transactional emails
- [ ] Test full auth flow in production

### Database Schema (Initial)

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles (extends auth.users)
create table profiles (
  id uuid references auth.users primary key,
  full_name text,
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Businesses
create table businesses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  name text not null,
  gstin text,
  status text default 'draft' check (status in ('draft', 'pending', 'verified', 'action_required')),
  structure text, -- pvt_ltd, llp, sole_prop, etc.
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Consultations
create table consultations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  business_id uuid references businesses,
  scheduled_at timestamptz not null,
  duration_minutes int default 30,
  phone text not null,
  language text default 'English',
  topics text[] default '{}',
  status text default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled', 'no_show')),
  created_at timestamptz default now()
);

-- Row Level Security
alter table profiles enable row level security;
alter table businesses enable row level security;
alter table consultations enable row level security;

-- Policies: Users can only access their own data
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

create policy "Users can view own businesses" on businesses
  for select using (auth.uid() = user_id);

create policy "Users can insert own businesses" on businesses
  for insert with check (auth.uid() = user_id);

create policy "Users can update own businesses" on businesses
  for update using (auth.uid() = user_id);

create policy "Users can view own consultations" on consultations
  for select using (auth.uid() = user_id);

create policy "Users can insert own consultations" on consultations
  for insert with check (auth.uid() = user_id);
```

---

## Learning Path

Since mastering the stack is a goal, here's the recommended order:

### Stage 1: Backend Fundamentals
1. Express + TypeScript project structure
2. Middleware patterns (auth, validation, logging)
3. Error handling best practices
4. API design (REST conventions)

### Stage 2: Database & Supabase
1. Postgres basics (if needed)
2. Supabase client usage
3. Row Level Security policies
4. Database migrations

### Stage 3: Docker & Deployment
1. Dockerfile basics
2. Multi-stage builds
3. Fly.io CLI and deployment
4. Environment variables in production

### Stage 4: Production Hardening
1. Vercel deployment
2. Sentry integration
3. Logging and monitoring
4. Domain and SSL setup

### Stage 5: Advanced (When Needed)
1. Background jobs with BullMQ + Upstash Redis
2. File uploads with Supabase Storage
3. Real-time with Supabase subscriptions
4. Performance optimization

---

## Decision Log

| Date | Decision | Rationale | Alternatives Considered |
|------|----------|-----------|------------------------|
| 2026-08-12 | Supabase for DB/Auth/Storage | Single platform, already using auth | PlanetScale, Neon, Firebase |
| 2026-08-12 | Express on Fly.io for backend | Full Node.js, no limits, free tier | Edge Functions, Railway, Render |
| 2026-08-12 | Separate backend repo | Clear separation, independent deploys | Monorepo with Turborepo |
| 2026-08-12 | Vercel for frontend | Best DX, free tier | Cloudflare Pages, Netlify |
| 2026-08-12 | Resend for email | Best DX, free tier | SendGrid, Mailgun |
| 2026-08-12 | GitHub Actions for CI/CD | Free, zero maintenance, production-grade | Jenkins (requires server) |

---

## Questions to Resolve

1. **Custom domain**: Do you have a domain? If not, when to purchase?
2. **Email sender**: What email address for transactional emails?
3. **Backup strategy**: Supabase Pro includes backups; free tier doesn't. Manual exports?
4. **Analytics**: Do we need user analytics? (PostHog free tier, or skip for now?)
5. **Backend repo name**: `ledgerline-api` or something else?

---

## Approval

- [x] Database choice: Supabase Postgres
- [x] Backend strategy: Express + Fly.io (separate repo)
- [x] Hosting strategy: Vercel (frontend) + Fly.io (backend)
- [x] Cost projection: $0 until significant growth
- [x] Architecture: Frontend calls backend directly, no BFF in production

**Status:** Ready to proceed with backend repo creation
