# JanSamvaad ResolveOS

ResolveOS is a unified, production-grade Next.js 14 civic grievance management platform. It streamlines the reporting, assignment, and resolution of systemic municipal issues (e.g., potholes, water leakage) utilizing a robust Role-Based Access Control (RBAC) architecture and geospatial clustering.

## 🏗 Architecture Overview
The platform has undergone a massive architectural migration from a legacy split-stack (Express + Next.js) into a unified Fullstack Next.js App Router ecosystem:

### Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL accessed via **Prisma ORM**
- **Authentication:** NextAuth.js (Custom Credentials + JWT)
- **UI Components:** Shadcn UI + Tailwind CSS
- **Forms & Validation:** React Hook Form + Zod

### Core Features
- 🔐 **Strict RBAC:** Segregated access for `USER`, `OFFICIAL`, and `ADMIN`.
- 🛤 **State Machine Enforcement:** Complaints transition through a rigorous lifecycle (`PENDING` -> `ACKNOWLEDGED` -> `IN_PROGRESS` -> `RESOLVED`) controlled by permissions.
- 📍 **Geospatial Processing:** Built-in Lat/Lng mappings for map integrations.
- 🛡 **Enterprise Security:** API routes hardened with sliding-limit Rate Limiting, DOMPurify/XSS sanitization, and strict CSP Headers.
- 📱 **Mobile Responsive Dashboards:** Clean Component-based UI patterns.

## 🚀 Quick Start
Please see [SETUP.md](./SETUP.md) for detailed local development and environment configurations.

## 📖 API Documentation
Please see [API.md](./API.md) for endpoint contracts, authentication mechanisms, and request/response payloads.