const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv-safe').config({ allowEmptyValues: true });

async function seedAdmin() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'operator'
      );
    `);
    const { rows } = await pool.query('SELECT username FROM users WHERE username = $1', ['operator']);
    if (rows.length === 0) {
      const hash = await bcrypt.hash('operator', 10);
      await pool.query('INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)', ['operator', hash, 'admin']);
      console.log('Seeded default admin user: operator / operator');
    } else {
      console.log('Admin user already exists.');
    }
  } catch (err) {
    console.error('Failed to seed admin user:', err);
  } finally {
    pool.end();
  }
}

seedAdmin();
