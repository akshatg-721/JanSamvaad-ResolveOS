# ResolveOS API Documentation

All API routes are served under `/api/*` and return a standardized JSON format adhering to the `ApiResponse<T>` contract.

## Standard Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15
  }
}
```

## Authentication (`/api/auth`)
- `POST /api/auth/callback/credentials`: Authenticates a user and returns a NextAuth session JWT.
- `POST /api/users/register`: Registers a new `USER` role.
- `GET /api/users/me`: Verifies and extracts the active Session payload.

## Complaints (`/api/complaints`)
All routes validate input via Zod schemas and enforce RBAC via the `withAuth` metadata wrapper.

- `GET /api/complaints?page=1&limit=10&status=PENDING`
  - Retrieves paginated index of complaints optionally scoped by category/severity/status.
  - **Auth:** Standard Session
- `POST /api/complaints`
  - Registers a new complaint.
  - **Body:** `{ title, description, category, location: { address } }`
- `GET /api/complaints/:id`
  - Retrieves comprehensive payload including associated Attachments and StatusHistories.
- `PATCH /api/complaints/:id/status`
  - Transitions complaint state. Enforces State Machine rules.
  - **Auth:** `OFFICIAL` or `ADMIN` only.
  - **Body:** `{ status: "IN_PROGRESS", comment: "Starting repairs today." }`

## Admin (`/api/admin`)
- `GET /api/admin/stats`: Retrieves top-level KPI telemetry (Total users, resolution rates).
- `GET /api/admin/complaints/export`: Generates synchronous CSV dump of all historical complaints.
