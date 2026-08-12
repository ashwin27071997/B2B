# B2B Platform - Project Context

> **Last Updated:** 2026-08-12
> **Status:** Active Development
> **Branch:** feature/business-onboarding

---

## Quick Reference

| Aspect | Details |
|--------|---------|
| **Stack** | React 19 + TypeScript 6 + Vite 8 |
| **Auth** | Supabase (migrated from Clerk) |
| **State** | Zustand (UI) + TanStack Query (server) |
| **Styling** | CSS Modules + CSS Variables |
| **Server** | Express BFF (abstraction layer) |
| **Constraints** | FREE TIER only |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                               │
│  localhost:5173                                              │
└─────────────────────┬───────────────────────────────────────┘
                      │ /api/v1/*
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   SERVER LAYER (BFF)                         │
│  localhost:3001                                              │
│  ├── JWT Verification (Supabase secret)                     │
│  ├── Rate Limiting (100 req/min)                            │
│  ├── Input Validation (Zod)                                 │
│  ├── Structured Logging (Pino)                              │
│  └── Request Forwarding                                      │
└─────────────────────┬───────────────────────────────────────┘
                      │ Proxied requests
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND SERVICE                            │
│  (External - URL hidden from client)                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Folder Structure

```
B2B/
├── src/                          # CLIENT (React)
│   ├── api/                      # API client layer
│   │   ├── client.ts             # Axios instance
│   │   ├── endpoints/            # API functions
│   │   ├── hooks/                # React Query hooks
│   │   └── types/                # Request/Response types
│   ├── components/               # Reusable UI
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Checkbox/
│   │   ├── Cube3D/               # 3D animated cube
│   │   ├── Divider/
│   │   ├── ErrorBoundary/
│   │   ├── ProtectedRoute/
│   │   ├── PublicRoute/
│   │   └── shared/               # Icons, Loading, Errors
│   ├── constants/                # App constants
│   │   ├── auth.ts
│   │   ├── routes.ts
│   │   └── validation.ts
│   ├── hooks/                    # Custom hooks
│   │   └── useLoginForm.ts
│   ├── lib/                      # External integrations
│   │   └── supabase.ts
│   ├── pages/                    # Route pages
│   │   ├── Login/
│   │   ├── Dashboard/
│   │   ├── BusinessOnboarding/
│   │   ├── ConsultationIntro/
│   │   ├── ConsultationBooking/
│   │   ├── ConsultationConfirmed/
│   │   └── SSOCallback/
│   ├── providers/                # React Context
│   │   ├── AuthProvider.tsx
│   │   ├── QueryProvider.tsx
│   │   └── useAuth.ts
│   ├── stores/                   # Zustand state
│   │   └── uiStore.ts            # Notifications, modals, sidebar
│   └── theme/                    # Design system
│       ├── globalStyles.css      # CSS variables
│       └── tokens.ts             # TypeScript tokens
│
├── server/                       # SERVER (Express BFF)
│   ├── index.ts                  # Entry point
│   ├── config/                   # Environment config
│   ├── lib/                      # Utilities
│   │   └── logger.ts             # Pino logger
│   ├── middleware/               # Express middleware
│   │   ├── auth.ts               # JWT verification
│   │   └── error-handler.ts
│   ├── routes/                   # API routes
│   │   ├── business.ts
│   │   └── consultation.ts
│   ├── services/                 # Backend client
│   │   └── backend-client.ts
│   └── validation/               # Zod schemas
│       ├── schemas.ts
│       └── middleware.ts
│
├── .env.example                  # Environment template
├── vite.config.ts                # Vite + proxy config
├── tsconfig.json                 # TypeScript config
└── package.json                  # Dependencies
```

---

## Design System

### CSS Variables (globalStyles.css)

```css
/* Colors */
--color-bg-primary: #08080C
--color-bg-card: linear-gradient(165deg, rgba(30, 31, 44, 0.96), ...)
--color-text-primary: #EEF0FA
--color-text-secondary: rgba(238, 240, 250, 0.6)
--color-primary: #6E7BFF (Indigo)
--color-secondary: #35C8DE (Cyan)
--color-error: #FF6B8A
--color-success: #35C8DE

/* Typography */
--font-primary: 'Manrope', sans-serif
--font-mono: 'DM Mono', monospace

/* Spacing */
--spacing-xs: 4px → --spacing-5xl: 56px

/* Radii */
--radius-sm: 6px → --radius-full: 999px
```

### Theme Philosophy
- Dark theme with glassmorphism effects
- Gradients for buttons and cards
- Cyan accents for success/completion states
- All values in CSS variables for easy theme switching

---

## Authentication Flow

```
1. User lands on /login
2. Email/password OR Google SSO
3. Supabase handles auth, returns JWT
4. AuthProvider stores session
5. Protected routes check auth state
6. API requests include Bearer token
7. Server verifies JWT signature
8. Requests forwarded to backend
```

### Key Files
- `src/providers/AuthProvider.tsx` - Auth context
- `src/providers/useAuth.ts` - Auth hook
- `server/middleware/auth.ts` - JWT verification

---

## State Management

### Zustand (UI State)
```typescript
// src/stores/uiStore.ts
- notifications: Toast messages with auto-dismiss
- modals: Open/close by ID
- sidebar: Toggle state
- globalLoading: App-wide loading indicator
```

### TanStack Query (Server State)
```typescript
// src/providers/QueryProvider.tsx
- 5 min stale time
- 30 min cache
- 1 retry on failure
- No refetch on window focus
```

---

## API Layer

### Client → Server → Backend

```
Browser Request:
POST /api/v1/business/register

↓ Vite proxy (dev)

Server Layer (localhost:3001):
- Verify JWT
- Validate body (Zod)
- Rate limit check
- Log request

↓ backend-client.ts

Backend Service:
POST https://actual-backend.com/api/v1/business/register
```

### React Query Hooks
```typescript
// Usage
const { data, isLoading } = useBusinesses();
const createBusiness = useCreateBusiness();
```

---

## Pages Implemented

| Page | Route | Status |
|------|-------|--------|
| Login | `/login` | ✅ Complete |
| Dashboard | `/dashboard` | ✅ Complete |
| Business Onboarding | `/onboarding/business` | ✅ Complete |
| Consultation Intro | `/consultation` | ✅ Complete |
| Consultation Booking | `/consultation/book` | ✅ Complete |
| Consultation Confirmed | `/consultation/confirmed` | ✅ Complete |
| SSO Callback | `/auth/callback` | ✅ Complete |

---

## Security Measures

| Feature | Implementation |
|---------|----------------|
| JWT Verification | `jsonwebtoken` with Supabase secret |
| Rate Limiting | `express-rate-limit` (100/min) |
| Input Validation | Zod schemas |
| CORS | Configured for frontend origin |
| Helmet | Security headers |
| Secrets | Server-side only, never exposed |

---

## Scripts

```bash
npm run dev          # Start client + server concurrently
npm run dev:client   # Vite only (port 5173)
npm run dev:server   # Express only (port 3001)
npm run build        # Production build
npm run lint         # OxLint
```

---

## Environment Variables

### Client (VITE_*)
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

### Server
```
SERVER_PORT=3001
NODE_ENV=development
BACKEND_API_URL=http://localhost:8000
BACKEND_API_KEY=
SUPABASE_SERVICE_KEY=
SUPABASE_JWT_SECRET=     # CRITICAL for production
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Pending / Future Work

### High Priority
- [ ] Unit tests (vitest + testing-library)
- [ ] Error tracking (Sentry)
- [ ] Fix `any` types in 3 components

### Medium Priority
- [ ] API documentation (Swagger)
- [ ] Database migrations strategy
- [ ] CI/CD pipeline

### Low Priority
- [ ] Performance monitoring (Web Vitals)
- [ ] Feature flags
- [ ] Analytics integration

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-08-09 | Migrated Clerk → Supabase | Free tier, simpler, all-in-one |
| 2026-08-10 | Added CSS variables | Scalability, theme switching |
| 2026-08-11 | Added Zustand + TanStack Query | Lightweight, type-safe |
| 2026-08-12 | Created server BFF layer | Security, backend abstraction |
| 2026-08-12 | Added JWT verification | Production security requirement |
| 2026-08-12 | Added Zod validation | Type-safe input validation |

---

## Reference Documents

- [CODING_STANDARDS.md](./CODING_STANDARDS.md) - **Read before writing any code**
- [stack-decision-table.html](./stack-decision-table.html) - Free tier comparison
- [Login screen design system](./Login%20screen%20design%20system%20(1)/) - UI mockups

---

## Notes for AI Assistant

### Before Writing Code
1. **Read CODING_STANDARDS.md** for guidelines
2. **Check this file** for project context
3. **Search existing code** before creating new

### While Writing Code
4. **Reuse existing** - components, hooks, utilities
5. **CSS variables only** - never hardcode colors, spacing, fonts
6. **TypeScript strict** - no `any`, proper types always
7. **Security first** - validate inputs, verify JWT, no secrets exposed
8. **Free tier only** - all services must have free tier options
9. **Keep it simple** - solve the stated problem, no over-engineering

### After Completing Work
10. **UPDATE THIS FILE** - Add new pages, components, decisions, env vars
11. **Update Decision Log** - Record what was done and why
12. **Check off Pending items** - Mark completed work in backlog
