# JanSamvaad - ResolveOS

## Overview
JanSamvaad ResolveOS is a civic complaint management platform that connects citizens, officials, and administrators in one workflow. Citizens can file issues with evidence, track progress, and upvote community problems while authorities manage resolution with role-based controls.

## Features
- User registration and secure authentication
- Complaint creation with optional image uploads
- Status tracking across full complaint lifecycle
- Upvote support for community prioritization
- Admin dashboard for monitoring and management
- Role-based access control (USER / OFFICIAL / ADMIN)

## Tech Stack
- Next.js 14+ (App Router)
- Prisma + PostgreSQL
- NextAuth.js (Credentials/JWT)
- Cloudinary for media storage
- Tailwind CSS + shadcn/ui
- Zod + TypeScript

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- Cloudinary account (optional for local dev, recommended for production)

### Installation
1. Clone the repository
2. Install dependencies:
   `npm install`
3. Copy env template:
   `cp .env.example .env`
4. Update environment values in `.env`
5. Run database migrations:
   `npx prisma migrate dev`
6. Generate Prisma client:
   `npx prisma generate`
7. Seed sample data:
   `npx prisma db seed`
8. Start development server:
   `npm run next-dev`

### Default Accounts
- Admin: `admin@jansamvaad.gov.in` / `Admin@123456`
- Official: `official@jansamvaad.gov.in` / `Official@123456`
- User: `rahul@example.com` / `User@123456`

## Project Structure
```text
app/                        # Next.js app routes used by runtime
src/
  app/                      # Extended app routes/pages for modular features
  components/               # Shared UI and feature components
  lib/                      # Auth, constants, utilities
  services/                 # Domain services
  repositories/             # Data access logic
  types/                    # Type augmentations and shared types
prisma/
  schema.prisma             # DB schema
  seed.ts                   # Idempotent seed data
```

## API Endpoints
- `POST /api/auth/register` - Register user
- `GET/POST /api/auth/[...nextauth]` - Auth handlers
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/complaints` - List complaints
- `POST /api/complaints` - Create complaint
- `GET/PATCH/DELETE /api/complaints/:id` - Complaint detail/update/delete
- `PATCH /api/complaints/:id/status` - Update complaint status
- `POST /api/complaints/:id/upvote` - Toggle upvote
- `POST /api/upload` - Upload files
- `DELETE /api/upload/:id` - Delete uploaded file
- `GET/PATCH /api/users/me` - Current user profile
- `PATCH /api/users/me/password` - Change password
- `GET /api/admin/users` - Admin-only user list

## License
MIT