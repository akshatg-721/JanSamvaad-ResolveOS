# 🗣️ JanSamvaad ResolveOS

> **"Voice mein bol do. Hum sun rahe hain."**
> *(Just speak. We are listening.)*

A multilingual AI-powered civic grievance system for India. Citizens call a phone number, speak their complaint in Hindi or English — and within 3 seconds, the grievance is auto-classified, ticketed, and live on an operator dashboard. No app. No form. No queue.

> 🏆 Built for **India Innovates 2026 — The FiSTA** | BML Munjal University

---

## 🔴 Live Demo

**Call right now:** `+1 570 630 8042`

Speak your complaint in Hindi or English. Watch the dashboard update in real time.

---

## 🚨 The Problem

- India generates **2 crore+ municipal grievances per year**
- CPGRAMS takes an average of **21 days** to resolve a complaint
- Existing systems (CPGRAMS, MyGov) require internet, smartphones, and literacy
- **65% of India** relies on basic phone calls — completely excluded from digital grievance systems
- 4,000+ municipalities with no intelligent, inclusive grievance infrastructure

---

## ✅ Our Solution

| Step | What Happens |
|------|-------------|
| 📞 Citizen calls | Dials our Twilio number — works on any basic phone |
| 🎙️ Speaks complaint | In Hindi or English, no typing required |
| 🤖 AI classifies | Gemini 2.0 Flash extracts intent, category & severity in **under 3 seconds** |
| 🎫 Ticket created | Auto-logged in PostgreSQL with reference number |
| 📊 Dashboard updates | Operator sees live ticket via WebSocket — zero data entry |
| 📱 SMS confirmation | Citizen gets ticket reference immediately |
| 🔍 Evidence upload | Operator can attach photos/documents |
| ✅ Resolution | One-click resolve sends SMS + QR receipt to citizen |

---

## 🏗️ Architecture

```
Citizen Call (Twilio)
       ↓
TRAI IVR (DND Check + Consent)
       ↓
Language Detection → Record → Transcribe
       ↓
Node.js + Express (Webhook Handler)
       ↓
Gemini 2.0 Flash (extractIntent → category, severity, summary)
       ↓
PostgreSQL (Ticket Created)
       ↓
Socket.IO (Real-time push)
       ↓
React Dashboard (Operator View)
       ↓
Evidence Upload → Resolve → SMS + QR Card
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| 📞 Citizen | Twilio Voice + SMS | IVR calls & SMS notifications |
| 🤖 AI | Google Gemini 2.0 Flash | Intent, category & severity extraction |
| ⚙️ Backend | Node.js + Express | REST API & webhooks |
| 🗄️ Data | PostgreSQL + Socket.IO | Persistent storage & real-time events |
| 🖥️ Frontend | React 18 + Vite + Tailwind | Live operator dashboard |
| 🔒 Security | JWT + node-cron + pino | Auth, SLA enforcement & structured logging |
| 🚀 Infra | Docker + nginx | 3-container deployment |

---

## ⚡ Why JanSamvaad Wins

| Feature | CPGRAMS | MyGov | JanSamvaad |
|---------|---------|-------|------------|
| Works without internet | ❌ | ❌ | ✅ |
| AI auto-classification | ❌ | ❌ | ✅ |
| Real-time dashboard | ❌ | ❌ | ✅ |
| SMS proof to citizen | ❌ | ❌ | ✅ |
| Under 3 sec response | ❌ | ❌ | ✅ |
| TRAI compliant | ❌ | ❌ | ✅ |
| Works on basic phone | ❌ | ❌ | ✅ |

---

## 🚀 Running Locally

### Prerequisites
- Docker + Docker Compose
- Twilio account with a phone number
- Google Gemini API key
- ngrok (for local webhook exposure)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/akshatg-721/JanSamvaad-ResolveOS.git
cd JanSamvaad-ResolveOS

# 2. Create your .env file
cp .env.example .env
# Fill in your Twilio, Gemini, and DB credentials

# 3. Start ngrok to expose your local backend
ngrok http 3000
# Copy the ngrok URL → set as APP_BASE_URL in .env
# Set it as webhook URL in Twilio console: <ngrok-url>/webhook/voice

# 4. Build and run
docker compose up --build
```

### Access
- **Dashboard:** http://localhost
- **Login:** `admin` / `admin123`
- **Backend API:** http://localhost:3000

---

## 📁 Project Structure

```
├── server.js                    # Express + Socket.IO entry point
├── src/
│   ├── webhooks/voice.js        # Twilio IVR, consent, transcription
│   ├── services/llm.js          # Gemini 2.0 Flash — extractIntent()
│   ├── crm/ticket.js            # Ticket creation, SLA logic
│   ├── api/
│   │   ├── auth.js              # JWT login
│   │   ├── dashboard.js         # /api/tickets, /api/stats
│   │   └── evidence.js          # Evidence upload, resolve endpoint
│   ├── middleware/
│   │   └── authenticateToken.js # JWT middleware
│   └── utils/logger.js          # pino structured logging
├── src/components/Dashboard.jsx # Full React operator dashboard
├── frontend/default.conf        # nginx reverse proxy config
├── docker-compose.yml           # 3-container orchestration
└── .env.example                 # Environment variable template
```

---

## 🌐 Environment Variables

```env
POSTGRES_DB=jansamvaad
POSTGRES_USER=postgres
POSTGRES_PASSWORD=yourpassword
DATABASE_URL=postgresql://postgres:yourpassword@postgres:5432/jansamvaad

TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX

GEMINI_API_KEY=your_gemini_key

PORT=3000
APP_BASE_URL=https://your-ngrok-url.ngrok-free.app
JWT_SECRET=your_32_char_secret
OPERATOR_USERNAME=admin
OPERATOR_PASSWORD=admin123
ENABLE_SLA_CRON=true
```

---

## 👥 Team

| Name | Role |
|------|------|
| **Akshat Goyal** ⭐ | Team Lead & Full Stack Developer |
| **Harsheet Dwivedi** | AI & Backend Engineer |
| **Pranav Aggarwal** | Frontend & UI Engineer |
| **Aditya Jain** | Research & Deployment Engineer |

**BML Munjal University** | India Innovates 2026 — The FiSTA

---

## 📊 Impact & Roadmap

**Current:** Working prototype with live Twilio IVR, Gemini AI, real-time dashboard, Docker deployment

**Roadmap:**
- Multi-language support (Tamil, Bengali, Marathi)
- WhatsApp channel integration
- Auto-escalation to district collectors
- Analytics dashboard for municipality performance
- Deployment across 4,000+ Indian municipalities

---

*Built with ❤️ for Bharat 🇮🇳*