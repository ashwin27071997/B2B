# Ledgerline B2B Platform - Frontend

Business onboarding and management platform for Ledgerline.

## Tech Stack

- **Framework:** React 19 + TypeScript + Vite
- **State:** Zustand + TanStack Query
- **Auth:** Supabase Auth
- **Styling:** CSS Modules
- **Linting:** Oxlint

For full tech stack decisions, see [TECH_STACK.md](./TECH_STACK.md).

## Prerequisites

1. **Node.js** (v20+ recommended)
   ```bash
   node --version  # Should be 20.x or higher
   ```

2. **Doppler CLI** (for secrets management)
   ```bash
   # macOS
   brew install dopplerhq/cli/doppler

   # Linux
   curl -sLf --retry 3 --tlsv1.2 --proto "=https" \
     'https://packages.doppler.com/public/cli/gpg.DE2A7741A397C129.key' | \
     sudo gpg --dearmor -o /usr/share/keyrings/doppler-archive-keyring.gpg
   echo "deb [signed-by=/usr/share/keyrings/doppler-archive-keyring.gpg] https://packages.doppler.com/public/cli/deb/debian any-version main" | \
     sudo tee /etc/apt/sources.list.d/doppler-cli.list
   sudo apt update && sudo apt install doppler

   # Windows (with scoop)
   scoop bucket add doppler https://github.com/DopplerHQ/scoop-doppler.git
   scoop install doppler
   ```

3. **Doppler Access**
   - Get invited to the Ledgerline Doppler project
   - Or create your own project following the setup below

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd B2B
npm install
```

### 2. Doppler Setup (First Time Only)

```bash
# Login to Doppler
doppler login

# Configure for this project (select ledgerline-b2b project and dev environment)
doppler setup
```

### 3. Run Development Server

```bash
# Start dev server (fetches secrets from Doppler automatically)
npm run dev

# This runs both:
# - Vite dev server (frontend) on http://localhost:5173
# - Express mock server (API proxy) on http://localhost:3001
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev with Doppler secrets (runs both client + server) |
| `npm run dev:client` | Vite dev server only |
| `npm run dev:server` | Express mock server only |
| `npm run build` | Production build |
| `npm run lint` | Run Oxlint |
| `npm run preview` | Preview production build |

## Environment Variables

All secrets are managed through **Doppler**. Never commit secrets to the repository.

### Required Variables

| Variable | Description | Used By |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | Client |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Client |
| `SERVER_PORT` | Express server port (default: 3001) | Server |
| `BACKEND_API_URL` | Backend API URL for proxy | Server |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | Server |
| `SUPABASE_JWT_SECRET` | JWT verification secret | Server |

### Testing New Environment Variables

You can use a local `.env.local` file for testing new variables before adding them to Doppler:

```bash
# 1. Add test variable to .env.local
echo "VITE_NEW_FEATURE_FLAG=true" >> .env.local

# 2. Run without Doppler to test
npm run dev:client

# 3. Once satisfied, add to Doppler dashboard
# 4. Remove from .env.local
```

**Note:** When running with `npm run dev`, Doppler secrets take precedence over local `.env` files.

## Project Structure

```
B2B/
├── src/
│   ├── components/     # Shared UI components
│   ├── constants/      # App constants and routes
│   ├── hooks/          # Global custom hooks
│   ├── lib/            # Utilities (supabase client, api client)
│   ├── pages/          # Page components
│   │   └── PageName/
│   │       ├── PageName.tsx        # Component
│   │       ├── PageName.hooks.ts   # Logic hook
│   │       ├── PageName.types.ts   # TypeScript types
│   │       └── PageName.module.css # Styles
│   ├── providers/      # React context providers
│   ├── stores/         # Zustand stores
│   └── types/          # Global TypeScript types
├── server/             # Express mock server (dev only)
├── CONTEXT.md          # Project context and decisions
├── CODING_STANDARDS.md # Coding guidelines
└── TECH_STACK.md       # Tech stack decisions
```

## Development Workflow

1. **Before starting work:** Pull latest and run `npm install`
2. **Start development:** `npm run client`
3. **Check types:** TypeScript errors show in Vite output
4. **Lint code:** `npm run lint`
5. **Before committing:** Ensure build passes with `npm run build`

## Documentation

- [CONTEXT.md](./CONTEXT.md) - Project context, architecture, and decision log
- [CODING_STANDARDS.md](./CODING_STANDARDS.md) - Coding guidelines and patterns
- [TECH_STACK.md](./TECH_STACK.md) - Technology choices and rationale

## Troubleshooting

### "Doppler: command not found"

Install Doppler CLI (see Prerequisites above).

### "No Doppler project selected"

Run `doppler setup` and select the project/environment.

### "VITE_SUPABASE_URL is undefined"

Either:
1. Run with `npm run dev` (uses Doppler)
2. Or create `.env.local` with required variables (see `.env.example`)

### Port already in use

The dev server uses ports 5173 (Vite) and 3001 (Express). Kill existing processes:
```bash
lsof -i :5173 -i :3001 | grep LISTEN | awk '{print $2}' | xargs kill -9
```
