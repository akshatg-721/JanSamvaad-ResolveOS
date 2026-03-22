require('dotenv-safe').config({ allowEmptyValues: true });
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const crypto = require('crypto');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const pool = require('./src/db');
const logger = require('./src/utils/logger');

// Feature-specific Routers
const voiceWebhookRouter = require('./src/webhooks/voice');
const authRouter = require('./src/api/auth');
const dashboardRouter = require('./src/api/dashboard');
const adminRouter = require('./src/api/admin');
const publicRouter = require('./src/api/public');
const evidenceRouter = require('./src/api/evidence');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGIN ? process.env.ALLOWED_ORIGIN.split(',') : '*',
    methods: ['GET', 'POST']
  }
});

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again later.' }
});

app.use('/api', globalLimiter);
app.use('/api/auth', authLimiter);

// Attach socket.io to request
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN ? process.env.ALLOWED_ORIGIN.split(',') : '*'
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Request logging + request ID
app.use((req, res, next) => {
  const requestId = crypto.randomUUID();
  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  req.log = logger.child({ requestId });
  req.log.info({ method: req.method, url: req.originalUrl, ip: req.ip }, 'Incoming Request');
  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Routes
app.use(voiceWebhookRouter);
app.use(authRouter);
app.use(dashboardRouter);
app.use(adminRouter);
app.use(publicRouter);
app.use(evidenceRouter);

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  (req.log || logger).error({ err, stack: err.stack, method: req.method, url: req.originalUrl }, 'Unhandled Error');
  if (res.headersSent) return next(err);

  // Zod validation errors
  if (err.name === 'ZodError') {
    return res.status(422).json({ error: 'Validation failed', details: err.errors });
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };
