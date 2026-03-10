# 🗣️ JanSamvaad ResolveOS
### India's First Voice-First Governance Operating System

> **"Voice mein bol do. Hum sun rahe hain."**
> *(Just speak. We are listening.)*

A multilingual AI-powered civic grievance system built for Bharat. Citizens call a phone number, speak their complaint in Hindi or English — the system automatically converts voice into structured civic tickets, visible to operators in real time. No app. No form. No queue. No smartphone required.

> 🏆 Built for **India Innovates 2026 — The FiSTA** | BML Munjal University

---

## 🚨 The Problem

Millions of grievances are registered annually across national and municipal portals, yet complaint intake, classification, and follow-up remain largely manual and fragmented.

- Existing grievance portals require internet access, smartphones, and digital literacy
- Over 300 million Indians rely on basic mobile phones — completely excluded from digital governance systems
- Municipal teams lack real-time visibility, evidence trails, and SLA accountability
- The result: complaints go unheard, trust in civic systems erodes

---

## ⏱️ Why Now?

Three trends make JanSamvaad possible today:

- **Multilingual AI** — Advances in AI models now enable accurate speech understanding across Indian languages
- **Digital India push** — Government momentum toward digital governance platforms creates the right policy environment
- **Cloud telephony at scale** — Scalable voice infrastructure makes citizen-facing IVR systems affordable and deployable nationwide

Together, these enable a new generation of voice-first civic infrastructure — and JanSamvaad is built to lead it.

---

## 🇮🇳 Alignment with National Initiatives

| Initiative | How JanSamvaad Aligns |
|-----------|----------------------|
| 🇮🇳 Digital India Mission | Voice-first interface bridges the digital divide |
| 🏙️ Smart Cities Command Centers | Real-time dashboard integrates with municipal ops |
| 🗣️ Bhashini Multilingual AI | Multilingual voice intake (Hindi, English — more planned) |
| 📱 Inclusive Governance | Works on any basic phone, no smartphone needed |
| 📊 Ease of Governance | Auto-classification eliminates manual data entry |

---

## ✅ How It Works

A villager calls to report a broken streetlight. Within seconds, the system generates a structured ticket and routes it to the correct ward. The citizen receives an SMS reference number immediately. Once the issue is resolved, they receive a QR-verified resolution proof — full accountability, zero paperwork.

| Step | What Happens |
|------|-------------|
| 📞 Citizen calls | Dials the number — works on any basic mobile phone |
| 🎙️ Speaks complaint | In Hindi or English, no typing or internet required |
| 🤖 AI classifies | Automatically extracts intent, category & severity within seconds |
| 🎫 Ticket created | Auto-logged with a unique reference number |
| 📊 Dashboard updates | Operator sees live ticket in real time — zero manual data entry |
| 📱 SMS confirmation | Citizen receives ticket reference immediately |
| 🔍 Evidence upload | Operator attaches photos or documents |
| ✅ Resolution | One-click resolve sends SMS + QR-verified receipt to citizen |

---

## 🌏 The Offline India Advantage

Over 300 million Indians still rely on basic mobile phones, making voice-first governance essential for inclusive civic participation. Because JanSamvaad relies on voice calls rather than smartphone apps, it can scale across India's 4,000+ municipalities and rural districts — reaching citizens that app-based solutions simply cannot.

---

## 🏗️ Architecture

```
Citizen Voice Call
       ↓
IVR Flow (DND Check + Consent)
       ↓
Language Detection → Record → Transcribe
       ↓
Node.js + Express (Webhook Handler)
       ↓
Gemini AI (Auto-classification → category, severity, summary)
       ↓
PostgreSQL (Ticket Created + Reference Generated)
       ↓
Socket.IO (Real-time push to dashboard)
       ↓
Operator Dashboard (React — Live View)
       ↓
Evidence Upload → Resolve → SMS + QR Resolution Card
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| 📞 Citizen Interface | Twilio Voice + SMS | IVR calls & SMS notifications |
| 🤖 AI Engine | Google Gemini AI | Auto-classification of grievances |
| ⚙️ Backend | Node.js + Express | REST API & webhook handling |
| 🗄️ Data | PostgreSQL + Socket.IO | Persistent storage & real-time events |
| 🖥️ Frontend | React 18 + Vite + Tailwind | Live operator dashboard |
| 🔒 Security | JWT + node-cron + pino | Auth, SLA enforcement & structured logging |
| 🚀 Infrastructure | Docker + nginx | 3-container deployment |

---

## ⚡ Voice-First vs Traditional Grievance Portals

| Feature | Traditional Grievance Portals | JanSamvaad ResolveOS |
|---------|-------------------------------|----------------------|
| Requires internet | ✅ Yes | ❌ Not required |
| Requires smartphone | ✅ Yes | ❌ Not required |
| AI auto-classification | ❌ No | ✅ Yes |
| Real-time operator dashboard | ❌ No | ✅ Yes |
| SMS proof to citizen | ❌ No | ✅ Yes |
| Works on basic phone | ❌ No | ✅ Yes |
| Zero manual data entry | ❌ No | ✅ Yes |
| QR-verified resolution receipt | ❌ No | ✅ Yes |

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
│   ├── webhooks/voice.js        # IVR flow, consent, transcription
│   ├── services/llm.js          # Gemini AI — auto-classification
│   ├── crm/ticket.js            # Ticket creation, SLA logic
│   ├── api/
│   │   ├── auth.js              # JWT login
│   │   ├── dashboard.js         # /api/tickets, /api/stats
│   │   └── evidence.js          # Evidence upload, resolve endpoint
│   ├── middleware/
│   │   └── authenticateToken.js # JWT middleware
│   └── utils/logger.js          # Structured logging
├── src/components/Dashboard.jsx # React operator dashboard
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

## 📊 Potential Impact

- **Faster grievance intake** through automated voice classification
- **Reduced manual workload** for municipal staff
- **Greater transparency** via QR-verified resolution receipts
- **Inclusive governance** for citizens without smartphones
- **Scalable** across India's 4,000+ municipalities and rural districts

**Roadmap:**
- Multi-language support (Tamil, Bengali, Marathi, Gujarati)
- WhatsApp channel integration
- Auto-escalation to district collectors
- Integration with Smart Cities Command Centers
- Bhashini API integration for broader language coverage

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

*Built with ❤️ for Bharat 🇮🇳*