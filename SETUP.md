# Local Setup Guide

Follow these instructions to deploy JanSamvaad ResolveOS locally on your development machine.

## Prerequisites
- Node.js >= 18.17.0
- Docker (for local PostgreSQL instance)

## 1. Database Initialization
Spin up a local PostgreSQL container:
```bash
docker run --name resolveos-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=resolveos -p 5432:5432 -d postgres
```

## 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure the `DATABASE_URL` accurately points to your local DB:
```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/resolveos?schema=public"
NEXTAUTH_SECRET="your-super-secret-key-at-least-32-chars"
DEFAULT_ROLE="USER"
```
*(Note: Using 127.0.0.1 bypasses common Windows local IPv6 pg connection issues).*

## 3. Installation & Prisma Generation
```bash
npm install
npx prisma generate
npx prisma db push
```

## 4. Seeding the Mock Data
Run the seeding script to populate the database with dummy Admin/Official/User roles and sample complaints:
```bash
npm run ts-node prisma/seed.ts
```

## 5. Booting the Server
```bash
npm run dev
```
The unified Next.js Application and API will be available at `http://localhost:3000`.

## 6. Testing
To run the Jest component and service layer test suites:
```bash
npm run test
```
