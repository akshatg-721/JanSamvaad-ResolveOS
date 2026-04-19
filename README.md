# 🇮🇳 JanSamvaad — AI-Powered Civic Grievance Redressal System

<div align="center">

![JanSamvaad Banner](https://img.shields.io/badge/JanSamvaad-Civic%20AI-F97316?style=for-the-badge&logo=google-cloud&logoColor=white)
![Live](https://img.shields.io/badge/Status-Live%20on%20GCP-22C55E?style=for-the-badge&logo=googlecloud&logoColor=white)
![Hackathon](https://img.shields.io/badge/India%20Innovates%202026-Rank%2039%20%2F%2026K%2B-1a3c6e?style=for-the-badge)

**Register a municipal complaint with a single phone call. No app. No internet. Just dial.**

[🌐 Live Demo](https://jan-samvaad-resolve-os.vercel.app) · [📊 Public Dashboard](https://jan-samvaad-resolve-os.vercel.app/public) · [📞 Try It](#try-it-now)

</div>

---

## 🎯 The Problem

India has **300M+ citizens** who file municipal complaints through broken, offline, or completely inaccessible processes. Road damage, water supply failures, electricity outages, sanitation issues — these complaints get lost in paperwork, wrong departments, and manual routing delays.

**JanSamvaad makes it as simple as making a phone call.**

---

## ✨ How It Works

```
Citizen calls toll-free number
        ↓
Twilio receives the call & streams audio
        ↓
Gemini 2.5 Flash transcribes + classifies complaint
(Category · Ward · Severity · Language — Hindi or English)
        ↓
Ticket created in PostgreSQL with SLA deadline
        ↓
SMS sent to citizen with ticket reference ID
        ↓
Automated voice callback confirms registration
        ↓
Operator dashboard shows ticket in real time
        ↓
AI analysis generated per ticket (priority · actions · ETA)
```

---

## 🚀 Features

### For Citizens
- 📞 **Voice-first** — call to register, no app or smartphone needed
- 🗣️ **Bilingual** — full support for Hindi and English
- 📲 **SMS confirmation** — ticket ID delivered instantly
- 🔔 **Voice callback** — automated call confirms your complaint is registered
- 🔍 **Track status** — check complaint status anytime at the public portal

### For Operators
- 📊 **Live dashboard** — real-time ticket feed with 10-second polling
- 🤖 **AI analysis per ticket** — Gemini generates priority score, root cause, suggested actions, and estimated resolution time
- 🗺️ **Ward heatmap** — visualise complaint density across all 20 wards
- ⏱️ **SLA tracking** — colour-coded countdown timers per ticket
- 📈 **Analytics** — category breakdown, resolution rate, severity distribution

### For the Public
- 🌐 **Transparency portal** — real-time civic data, no login required
- 📊 **Live stats** — total complaints, resolution rate, category breakdown

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Voice Pipeline** | Twilio Programmable Voice + TwiML |
| **AI / NLP** | Google Gemini 2.5 Flash |
| **Backend** | Node.js · Express.js |
| **Database** | PostgreSQL (Neon DB) · SLA indexing |
| **Frontend** | Next.js 14 · TypeScript · Tailwind CSS |
| **Deployment** | Google Cloud Run · Docker · GitHub Actions CI/CD |
| **Auth** | JWT · bcrypt |
| **Real-time** | Socket.IO · 10s polling |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CITIZEN                          │
│              Calls toll-free number                 │
└───────────────────┬─────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────┐
│                  TWILIO                             │
│     Receives call → streams to webhook              │
└───────────────────┬─────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────┐
│            NODE.JS / EXPRESS (GCP Cloud Run)        │
│                                                     │
│  ┌─────────────┐    ┌──────────────────────────┐   │
│  │ Voice       │    │  Gemini 2.5 Flash        │   │
│  │ Webhook     │───▶│  • Transcription         │   │
│  │             │    │  • Classification        │   │
│  │             │    │  • Ward extraction       │   │
│  └──────┬──────┘    │  • Language detection    │   │
│         │           └──────────────────────────┘   │
│         ▼                                           │
│  ┌─────────────┐    ┌──────────────────────────┐   │
│  │ PostgreSQL  │    │  Twilio SMS + Callback   │   │
│  │ (Neon DB)   │    │  • Ticket ID via SMS     │   │
│  │ • Tickets   │    │  • Voice confirmation    │   │
│  │ • Wards     │    └──────────────────────────┘   │
│  │ • SLA       │                                   │
│  └─────────────┘                                   │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│            NEXT.JS FRONTEND (Vercel)                │
│                                                     │
│  • Operator Dashboard (live tickets + AI analysis)  │
│  • Public Transparency Portal (no login required)   │
│  • Complaint Tracker (citizens track by ref ID)     │
└─────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
JanSamvaad-ResolveOS/
├── src/
│   ├── api/
│   │   └── dashboard.js        # REST API routes + AI analysis endpoint
│   ├── services/
│   │   └── llm.js              # Gemini AI integration
│   ├── webhooks/
│   │   └── voice.js            # Twilio voice pipeline
│   └── db/
│       └── schema.sql          # PostgreSQL schema
├── frontend/
│   ├── app/
│   │   ├── page.jsx            # Landing page
│   │   ├── dashboard/          # Operator dashboard
│   │   ├── public/             # Transparency portal
│   │   ├── track/              # Complaint tracker
│   │   └── login/              # Operator login
│   └── components/
│       └── BrandLogo.tsx       # Inline SVG brand component
├── server.js                   # Express server entry point
├── .github/workflows/
│   └── deploy.yml              # CI/CD → GCP
└── docker-compose.yml          # Local development
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL (or Neon DB account)
- Google Cloud account (Gemini API key)
- Twilio account

### 1. Clone & Install
```bash
git clone https://github.com/akshatg-721/JanSamvaad-ResolveOS.git
cd JanSamvaad-ResolveOS
npm install
cd frontend && npm install && cd ..
```

### 2. Environment Variables

Create `.env` in root:
```env
DATABASE_URL=postgresql://user:password@host:5432/jansamvaad
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
JWT_SECRET=your_jwt_secret_min_32_chars
OPERATOR_USERNAME=admin
OPERATOR_PASSWORD=your_password
ALLOWED_ORIGIN=http://localhost:3000
ENABLE_CALLBACK=false
PORT=3000
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Database Setup
```bash
psql $DATABASE_URL -f src/db/schema.sql
```

### 4. Run Locally
```bash
# Terminal 1 — Backend
npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Backend runs on `http://localhost:3000`
Frontend runs on `http://localhost:3001`

---

## 📞 Try It Now

The system is live on GCP. To test the voice pipeline:

1. Call **+1 570 630 8042**
2. Describe your complaint in Hindi or English
3. You'll receive an SMS with your ticket ID
4. Track your complaint at [jan-samvaad-resolve-os.vercel.app/track](https://jan-samvaad-resolve-os.vercel.app/track)

---

## 🏆 Recognition

| Event | Result |
|-------|--------|
| **India Innovates 2026** — FiSTA National Hackathon | 🥇 Rank **39 / 26,000+** participants |
| **Venue** | Bharat Mandapam, New Delhi |
| **Date** | March 28, 2026 |
| **Demo** | Live GCP deployment — real calls, real tickets, real AI |

---

## 🔮 Roadmap

- [ ] WhatsApp integration for complaint registration
- [ ] Multilingual support (Tamil, Bengali, Marathi)
- [ ] Officer mobile app for field updates
- [ ] Predictive analytics for recurring complaint hotspots
- [ ] Integration with municipal ERP systems

---

## 👨‍💻 Author

**Akshat Goyal**
B.Tech Computer Science & Engineering, 1st Year
BML Munjal University, Gurugram

[![Email](https://img.shields.io/badge/Email-akshatgtech721%40gmail.com-D14836?style=flat&logo=gmail&logoColor=white)](mailto:akshatgtech721@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/akshat-goyal)

---

## 📄 License

MIT License — feel free to fork, build, and improve.

---

<div align="center">

**Built for India. Built with ❤️ and a lot of debugging at 3 AM.**

*"No app. No internet. Just a phone call."*

</div>
