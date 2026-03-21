require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const crypto = require('crypto');
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
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Attach socket.io to request 
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  const requestId = crypto.randomUUID();
  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  req.log = logger.child({ requestId });
  
  // Request Logging
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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  (req.log || logger).error({ err, stack: err.stack, method: req.method, url: req.originalUrl }, 'Unhandled Error');
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

module.exports = { app, server, io };
