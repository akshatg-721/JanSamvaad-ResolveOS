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
      paths: ['phone', 'token', 'transcript', 'body.phone', 'body.token', 'Authorization', 'headers.authorization'],
      censor: '****'
    }
  },
  transport
);

module.exports = logger;
