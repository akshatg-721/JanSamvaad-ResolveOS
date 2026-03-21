require('dotenv').config();
const pool = require('./src/db');

async function migrate() {
  try {
    console.log("Migrating database for Phase 1-4...");
    await pool.query(`
      ALTER TABLE tickets ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
      ALTER TABLE tickets ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
      ALTER TABLE tickets ADD COLUMN IF NOT EXISTS geo_address TEXT;
      ALTER TABLE tickets ADD COLUMN IF NOT EXISTS location_accuracy INTEGER;
      ALTER TABLE tickets ADD COLUMN IF NOT EXISTS nearby_landmarks TEXT[];
      ALTER TABLE tickets ADD COLUMN IF NOT EXISTS sentiment VARCHAR(20);
      ALTER TABLE tickets ADD COLUMN IF NOT EXISTS frustration_level VARCHAR(20);
      ALTER TABLE tickets ADD COLUMN IF NOT EXISTS detected_language VARCHAR(10);
      ALTER TABLE tickets ADD COLUMN IF NOT EXISTS translated_text TEXT;
      ALTER TABLE tickets ADD COLUMN IF NOT EXISTS weather_condition VARCHAR(50);
      ALTER TABLE tickets ADD COLUMN IF NOT EXISTS temperature DECIMAL(4,1);
      ALTER TABLE tickets ADD COLUMN IF NOT EXISTS weather_boosted BOOLEAN DEFAULT false;
      ALTER TABLE tickets ADD COLUMN IF NOT EXISTS is_duplicate BOOLEAN DEFAULT false;
      ALTER TABLE tickets ADD COLUMN IF NOT EXISTS duplicate_of INTEGER REFERENCES tickets(id);
    `);
    console.log("Migration successful.");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    pool.end();
  }
}

migrate();
