# JanSamvaad ResolveOS (Frontend-First Branch)

## Branch intent
This branch preserves the polished Next.js frontend UI/UX and isolates backend-heavy implementation details so the frontend can be merged with the `main` backend later with minimal conflict.

## What is preserved
- Current pages, layouts, navigation, and visual system in `app/` and `components/`
- Dashboard experience (overview, GIS, ledger, analytics, settings)
- Resolution/feedback UI flows (`/resolve/[id]`, `/feedback/[id]`, `/public/resolve/[id]`)
- UI component library and styling tokens

## What was isolated
Backend-coupled code has been moved under `legacy-backend/` to keep active frontend paths clean:
- Next route handlers previously in `app/api/`
- Legacy `src/app/`, `src/api/`, `src/db/`, `src/services/`, `src/repositories/`, `src/webhooks/`, and related server internals
- Legacy Prisma-generated and server orchestration files

## Frontend-canonical folders
- `app/` : active frontend routes/pages
- `components/` : active UI and dashboard sections
- `hooks/` : frontend data/realtime hooks
- `src/lib/api/` : API abstraction layer
- `src/lib/contracts/` : frontend DTO contracts
- `src/lib/mappers/` : backend-response normalization
- `src/lib/auth/` : frontend auth/session adapter

## API abstraction design
Frontend now calls API abstractions instead of backend internals.

### API clients
- `src/lib/api/client.ts`
- `src/lib/api/endpoints.ts`
- `src/lib/api/complaints.ts`
- `src/lib/api/users.ts`
- `src/lib/api/dashboard.ts`
- `src/lib/api/upload.ts`
- `src/lib/api/auth.ts`

### Contracts
- `src/lib/contracts/complaint.ts`
- `src/lib/contracts/user.ts`
- `src/lib/contracts/dashboard.ts`
- `src/lib/contracts/notification.ts`
- `src/lib/contracts/common.ts`

### Mappers
- `src/lib/mappers/complaint.mapper.ts`
- `src/lib/mappers/user.mapper.ts`
- `src/lib/mappers/dashboard.mapper.ts`

## Auth decoupling
Frontend auth consumption is now adapter-based:
- `src/lib/auth/client.ts` exposes `login`, `logout`, `register`, `getSessionUser`, `requireFrontendAuth`
- `src/lib/auth/session.ts` manages lightweight frontend session/token storage
- UI pages no longer directly depend on NextAuth internals

## Environment setup
Copy `.env.example` to `.env` and set at least:
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_SOCKET_URL`
- `NEXT_PUBLIC_AUTH_MODE`

## Run frontend
```bash
npm install
npm run dev
```

## Validate
```bash
npx tsc --noEmit
npm run build
```

## Legacy backend (optional)
Legacy backend code is archived under `legacy-backend/`.
If needed for reference or temporary local use:
```bash
npm run server
```

## How to integrate with main backend later
1. Keep UI/components unchanged.
2. Remap endpoint paths in `src/lib/api/endpoints.ts` to `main` backend routes.
3. Adjust response normalization in `src/lib/mappers/*` only.
4. Keep DTO contracts stable so page/component code does not change.
5. If auth semantics differ, adapt only `src/lib/auth/*` and `src/lib/api/auth.ts`.

This branch is now frontend-first and merge-ready for backend integration.

