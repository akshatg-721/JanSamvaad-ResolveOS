# JanSamvaad ResolveOS
**Team Name:** ResolveOS Builders  
**Date:** 2026-03-05

## Problem & Solution
Indian municipal grievance systems are fragmented across helplines, paper workflows, and disconnected portals. Citizens struggle with language barriers and poor visibility into issue closure, while operations teams lack structured intake and SLA tracking.

JanSamvaad ResolveOS provides multilingual voice-first grievance intake, AI-based intent extraction, structured ticketing, evidence links, and real-time closure tracking. It combines Twilio voice workflows, Gemini extraction, Postgres persistence, and a live dashboard to produce a practical, compliance-aware civic operations stack.

## Architecture Overview
- **Voice Intake:** Twilio webhooks handle incoming calls, DND checks, and TRAI-aligned consent.
- **AI Structuring:** Gemini extracts category, ward, urgency, and summary from transcript text.
- **Ticket Engine:** Node/Express + Postgres create contacts/tickets and compute SLA deadlines.
- **Evidence + Closure:** SHA-256 evidence URL generation, ticket resolution flow, SMS notifications.
- **Operations UI:** React dashboard shows open/closed KPIs, breach risk, and closure QR verification.
- **Ops Tooling:** CI workflow, Docker compose stack, unit/integration/load testing scripts.

## Cost Breakdown (₹4,496 total)
| Item | Monthly Cost (₹) |
|---|---:|
| Twilio telephony & SMS | 1,650 |
| Cloud VM / hosting | 1,200 |
| Managed Postgres / storage | 900 |
| AI inference (Gemini usage) | 600 |
| Monitoring / misc infra | 146 |
| **Total** | **4,496** |

## KPI Definitions
- **Open Tickets:** Count of tickets with status `open`.
- **Closed Tickets:** Count of tickets with status `closed`.
- **SLA Hit Rate:** `(closed / (open + closed)) * 100`.

## Compliance Checklist
- [x] TRAI-aligned call consent gate before intake
- [x] DND scrub before any grievance collection
- [x] Phone masking in dashboard output
- [x] Evidence URL hashing (SHA-256 seed based)
- [x] Consent logging in `call_consents` table

## Demo Flow (Judge Walkthrough)
1. Judge places test call to Twilio number.
2. System announces consent and asks for opt-in.
3. Caller selects language and records complaint.
4. Backend extracts intent and creates ticket with SLA.
5. Dashboard reflects ticket updates.
6. Operator resolves ticket via API/UI flow.
7. Citizen receives SMS containing evidence upload and resolution card links.
8. Dashboard shows closed ticket with QR code for verification.

## Acceptance Criteria Checklist
- [x] `docker compose up` boots Postgres + backend + frontend stack
- [x] End-to-end call intake to ticket creation is implemented
- [x] Evidence URL generation and resolution flow are implemented
- [x] KPI endpoints and dashboard view are available
- [x] Unit, integration, and load test scripts are present
- [x] CI pipeline runs install, tests, frontend build, and Docker build
