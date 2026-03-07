# JanSamvaad ResolveOS

## Problem Statement
Urban civic grievance resolution is slow, language-fragmented, and often inaccessible to citizens who are not comfortable with apps and forms. Municipal teams also struggle to maintain evidence trails, SLA monitoring, and compliant consent workflows.

JanSamvaad ResolveOS enables citizens to report issues through voice calls in multilingual flows, automatically structures grievances using AI, creates trackable tickets, and gives operators a real-time dashboard with evidence and closure workflows.

## Architecture Diagram (ASCII)
```
Citizen Call
   |
   v
Twilio Voice Webhooks (/voice -> /consent -> /lang -> /record)
   |
   v
Express API Layer -----------------------> Socket.IO Events
   |                                          |
   |                                          v
   |                                   React Dashboard (KPI/Feed/QR)
   v
Gemini Intent Extraction (AI)
   |
   v
CRM Ticket Service -> PostgreSQL (contacts, tickets, wards, call_consents)
   |
   v
Evidence + Resolution APIs -> Twilio SMS -> Citizen Upload Link
```

## Tech Stack table
| Layer | Technology |
|---|---|
| Backend | Node.js, Express, Socket.IO |
| Voice/Comms | Twilio Voice, Twilio SMS |
| AI | Gemini 1.5 Flash via @google/genai |
| Database | PostgreSQL |
| Frontend | React, Vite, Tailwind CSS |
| Testing | Jest, Supertest, k6 |
| Infra | Docker, Docker Compose, GitHub Actions |
| Hardware | escpos, escpos-usb thermal printer |

## Quick Start (docker compose up)
```bash
cp .env.example .env
docker compose up --build
```

Services:
- Backend: `http://localhost:3000`
- Frontend: `http://localhost`
- Postgres: `localhost:${POSTGRES_PORT}`

## Environment Variables (table from .env.example)
| Variable | Purpose |
|---|---|
| POSTGRES_DB | Postgres database name |
| POSTGRES_USER | Postgres user |
| POSTGRES_PASSWORD | Postgres password |
| POSTGRES_PORT | Postgres exposed port |
| DATABASE_URL | Backend DB connection string |
| TWILIO_ACCOUNT_SID | Twilio account SID |
| TWILIO_AUTH_TOKEN | Twilio auth token |
| TWILIO_PHONE_NUMBER | Twilio sender number |
| GEMINI_API_KEY | Gemini API key |
| GOOGLE_API_KEY | Alternate Gemini key |
| PORT | Backend HTTP port |
| NODE_ENV | Environment mode |
| APP_BASE_URL | Public app base URL |
| EVIDENCE_BASE_URL | Evidence URL base |
| ALLOWED_ORIGIN | CORS allowed origin |
| SMTP_HOST | SMTP server host |
| SMTP_PORT | SMTP server port |
| SMTP_USER | SMTP username/from address |
| SMTP_PASS | SMTP password |
| ALERT_EMAIL | SLA alert recipient |
| DND_LIST | Comma-separated DND numbers |
| ENABLE_SLA_CRON | Toggle hourly SLA cron |

## API Reference (route table: method, path, description, auth)
| Method | Path | Description | Auth |
|---|---|---|---|
| GET | /health | Service health status | None |
| POST | /voice | Voice entrypoint + consent gather | Twilio webhook |
| POST | /consent | Consent capture and branching | Twilio webhook |
| POST | /lang | Language selection | Twilio webhook |
| POST | /record | Recording processing and ticket creation | Twilio webhook |
| GET | /api/tickets | Latest ticket feed (masked phones) | None |
| GET | /api/stats | KPI stats and SLA hit rate | None |
| POST | /api/evidence/upload | Generate and save evidence URL/hash | None |
| POST | /api/tickets/:id/resolve | Close ticket + send SMS + socket emit | None |

## Running Tests
```bash
npm ci
npm --prefix frontend ci
npm test
npm run test:cov
```

## Load Testing
```bash
k6 run scripts/load.js
```
Optional overrides:
```bash
BASE_URL=http://localhost:3000 LOAD_ENDPOINT=/record k6 run scripts/load.js
```

## Compliance (TRAI consent, DND, encryption note)
- Consent IVR is enforced before data collection.
- DND scrub runs at call entry and blocks opted-out numbers.
- Evidence links are generated using SHA-256 hash seeds.
- Phone numbers are masked in dashboard responses.

## Known Limitations
- Voice transcription function currently expects transcript-like input; direct STT from audio URL should be added for production telephony.
- Frontend dashboard is in demo-friendly local-state mode; live polling/socket hydration can be enabled as next step.
- SLA alert email depends on SMTP configuration being available.

## License
MIT
