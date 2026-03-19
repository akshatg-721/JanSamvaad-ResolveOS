const express = require('express');
const http = require('http');
const crypto = require('crypto');
const cors = require('cors');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
dotenv.config();

const pool = require('./src/db');
const { setIo } = require('./src/crm/ticket');
const logger = require('./src/utils/logger');


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*' // Allow all origins for development
  }
});

const PORT = Number(process.env.PORT || 3000);
app.set('io', io);
setIo(io);

function parseAllowedOrigins() {
  const raw = process.env.ALLOWED_ORIGIN || process.env.ALLOWED_ORIGINS || '';
  const parsed = raw
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (parsed.length > 0) {
    return parsed;
  }

  return [
    'http://localhost:3001',
    'http://localhost:5173',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:5173'
  ];
}

const allowedOrigins = parseAllowedOrigins();
const isDevLike = process.env.NODE_ENV !== 'production';

const voiceWebhookRouter = require('./src/webhooks/voice');
const authRouter = require('./src/api/auth');
const dashboardRouter = require('./src/api/dashboard');
const evidenceRouter = require('./src/api/evidence');

app.use(cors({ 
  origin(origin, callback) {
    if (!origin || isDevLike) {
      callback(null, true);
      return;
    }
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('CORS origin not allowed'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res, next) => {
  const requestId = crypto.randomUUID();
  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  req.log = logger.child({ requestId });
  next();
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

app.use('/', voiceWebhookRouter);
app.use('/', authRouter);
app.use('/', dashboardRouter);
app.use('/', evidenceRouter);

async function runSlaBreachAlerts() {
  try {
    const { rows } = await pool.query(
      `SELECT id, ref, category, severity, status, sla_deadline, created_at
       FROM tickets
       WHERE status = 'open'
         AND sla_deadline < NOW() + INTERVAL '2 hours'`
    );

    if (rows.length === 0) {
      return;
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const alertEmail = process.env.ALERT_EMAIL;

    const canSendEmail = smtpHost && smtpUser && smtpPass && alertEmail;
    const transporter = canSendEmail
      ? nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      })
      : null;

    for (const ticket of rows) {
      io.emit('sla_breach', ticket);

      if (!transporter) {
        continue;
      }

      await transporter.sendMail({
        from: smtpUser,
        to: alertEmail,
        subject: `SLA Breach Alert: Ticket ${ticket.ref}`,
        text: `Ticket ${ticket.ref} is approaching SLA breach.\nCategory: ${ticket.category}\nSeverity: ${ticket.severity}\nDeadline: ${ticket.sla_deadline}`
      });
    }
  } catch (error) {
    logger.error({ err: error }, 'SLA breach cron failed');
  }
}

let cronTask = null;
if (process.env.ENABLE_SLA_CRON !== 'false' && process.env.NODE_ENV !== 'test') {
  cronTask = cron.schedule('0 * * * *', () => {
    runSlaBreachAlerts();
  });
}

function startServer() {
  return pool.ensureDbReady()
    .then(() => {
      logger.info('Database schema compatibility checks completed');
      return server.listen(PORT, () => {
        logger.info({ port: PORT }, 'JanSamvaad ResolveOS server listening');
      });
    })
    .catch((error) => {
      logger.error({ err: error }, 'Failed to initialize database schema');
      throw error;
    });
}

if (require.main === module) {
  startServer();
}

module.exports = {
  app,
  io,
  server,
  startServer,
  runSlaBreachAlerts,
  cronTask
};
