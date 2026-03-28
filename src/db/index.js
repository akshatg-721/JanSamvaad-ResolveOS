'use strict';

require('dotenv').config();

const { Pool } = require('pg');
const logger = require('../utils/logger');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function connectWithRetry(maxAttempts = 3, delayMs = 2000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const client = await pool.connect();
      client.release();
      logger.info({ attempt }, 'Database connected successfully');
      return;
    } catch (err) {
      logger.warn({ attempt, maxAttempts, err }, `Database connection attempt ${attempt}/${maxAttempts} failed`);
      if (attempt < maxAttempts) {
        await new Promise(r => setTimeout(r, delayMs));
      } else {
        logger.error('All database connection attempts exhausted — will retry on first query');
      }
    }
  }
}

connectWithRetry();

module.exports = pool;
