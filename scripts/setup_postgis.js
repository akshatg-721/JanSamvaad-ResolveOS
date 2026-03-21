require('dotenv').config();
const pool = require('./src/db');

async function checkPostGIS() {
  try {
    const res = await pool.query("SELECT postgis_version()");
    console.log("PostGIS Version:", res.rows[0].postgis_version);
    
    console.log("Adding GEOMETRY column to wards if missing...");
    await pool.query("CREATE EXTENSION IF NOT EXISTS postgis");
    await pool.query("ALTER TABLE wards ADD COLUMN IF NOT EXISTS boundary GEOMETRY(POLYGON, 4326)");
    console.log("Done.");
  } catch (err) {
    console.log("PostGIS check/setup failed:", err.message);
  } finally {
    pool.end();
  }
}

checkPostGIS();
