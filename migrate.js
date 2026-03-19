require('dotenv').config();
const pool = require('./src/db');

async function migrate() {
  try {
    console.log('Migrating database...');
    await pool.ensureDbReady();
    console.log('Migration successful.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    pool.end();
  }
}

migrate();
