require('dotenv').config();
const pool = require('./src/db');

async function setupTrgm() {
  try {
    console.log("Enabling pg_trgm and creating index...");
    await pool.query("CREATE EXTENSION IF NOT EXISTS pg_trgm");
    await pool.query("CREATE INDEX IF NOT EXISTS idx_tickets_summary_trgm ON tickets USING gin (summary向 gin_trgm_ops)");
    console.log("Done.");
  } catch (err) {
    console.error("Setup failed:", err.message);
  } finally {
    pool.end();
  }
}

setupTrgm();
