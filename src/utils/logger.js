const pino = require('pino');

const isDevelopment = process.env.NODE_ENV !== 'production';
const level = process.env.LOG_LEVEL || 'info';

const transport = isDevelopment
  ? pino.transport({
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard'
    }
  })
  : undefined;

const logger = pino(
  {
    level,
    redact: {
      paths: [
        // Top-level keys
        'phone', 'token', 'transcript', 'password', 'password_hash',
        // Nested in body/payload
        'body.phone', 'body.token', 'body.password', 'body.transcript',
        'payload.phone', 'payload.token', 'payload.password',
        // HTTP headers
        'headers.authorization', 'headers.cookie',
        'req.headers.authorization', 'req.headers.cookie',
        // Auth context
        'Authorization',
      ],
      censor: '****'
    }
  },
  transport
);

module.exports = logger;
