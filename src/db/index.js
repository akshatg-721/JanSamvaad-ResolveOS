const path = require('path');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config({
  path: path.resolve(__dirname, '../../.env')
});

const connectionString = (process.env.DATABASE_URL || '').trim();
const fallbackPassword = process.env.PGPASSWORD ?? process.env.POSTGRES_PASSWORD ?? '';

const pool = new Pool(
  connectionString
    ? {
        connectionString,
        password: String(fallbackPassword)
      }
    : {
        host: process.env.PGHOST || process.env.POSTGRES_HOST || '127.0.0.1',
        port: Number(process.env.PGPORT || process.env.POSTGRES_PORT || 5432),
        database: process.env.PGDATABASE || process.env.POSTGRES_DB,
        user: process.env.PGUSER || process.env.POSTGRES_USER,
        password: String(fallbackPassword)
      }
);

async function ensureDbReady() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS pg_trgm;
      CREATE TABLE IF NOT EXISTS wards (
        id SERIAL PRIMARY KEY,
        name VARCHAR(120) NOT NULL UNIQUE
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        phone VARCHAR(20) NOT NULL UNIQUE,
        consent BOOLEAN NOT NULL DEFAULT TRUE,
        dnd BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS tickets (
        id SERIAL PRIMARY KEY,
        contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
        ref VARCHAR(20) NOT NULL UNIQUE,
        category VARCHAR(50) NOT NULL,
        ward_id INTEGER REFERENCES wards(id) ON DELETE SET NULL,
        severity VARCHAR(20) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'open',
        sla_deadline TIMESTAMPTZ,
        evidence_url TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        closed_at TIMESTAMPTZ
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS call_consents (
        id SERIAL PRIMARY KEY,
        phone VARCHAR(20) NOT NULL,
        consented BOOLEAN NOT NULL,
        timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    await client.query(`
      ALTER TABLE tickets
      ADD COLUMN IF NOT EXISTS resolve_token VARCHAR(64),
      ADD COLUMN IF NOT EXISTS feedback_rating INTEGER,
      ADD COLUMN IF NOT EXISTS feedback_text TEXT,
      ADD COLUMN IF NOT EXISTS sentiment VARCHAR(20),
      ADD COLUMN IF NOT EXISTS frustration_level VARCHAR(20),
      ADD COLUMN IF NOT EXISTS detected_language VARCHAR(50),
      ADD COLUMN IF NOT EXISTS translated_text TEXT,
      ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
      ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
      ADD COLUMN IF NOT EXISTS geo_address TEXT,
      ADD COLUMN IF NOT EXISTS location_accuracy VARCHAR(50),
      ADD COLUMN IF NOT EXISTS nearby_landmarks TEXT,
      ADD COLUMN IF NOT EXISTS weather_condition VARCHAR(50),
      ADD COLUMN IF NOT EXISTS temperature DECIMAL(5, 2),
      ADD COLUMN IF NOT EXISTS weather_boosted BOOLEAN;
    `);
    await client.query(`
      ALTER TABLE tickets DROP CONSTRAINT IF EXISTS tickets_severity_check;
      ALTER TABLE tickets ADD CONSTRAINT tickets_severity_check
      CHECK (severity IN ('Critical', 'High', 'Medium', 'Low'));
    `);
    await client.query(`
      ALTER TABLE tickets DROP CONSTRAINT IF EXISTS tickets_status_check;
      ALTER TABLE tickets ADD CONSTRAINT tickets_status_check
      CHECK (status IN ('open', 'in-progress', 'in_progress', 'resolved', 'closed'));
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
      CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_tickets_contact_id ON tickets(contact_id);
      CREATE INDEX IF NOT EXISTS idx_tickets_sla_deadline ON tickets(sla_deadline);
      CREATE INDEX IF NOT EXISTS idx_call_consents_phone ON call_consents(phone);
    `);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

pool.ensureDbReady = ensureDbReady;

module.exports = pool;
