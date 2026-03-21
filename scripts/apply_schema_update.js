const pool = require('./src/db');
const fs = require('fs');

async function runUpdate() {
  try {
    const sql = fs.readFileSync('c:\\Users\\harsheet\\AppData\\Local\\Temp\\update_schema.sql', 'utf8');
    console.log('Executing SQL update...');
    await pool.query(sql);
    console.log('Schema update successful!');
    process.exit(0);
  } catch (err) {
    console.error('Schema update failed:', err);
    process.exit(1);
  }
}

runUpdate();
