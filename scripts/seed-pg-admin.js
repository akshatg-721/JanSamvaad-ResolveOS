const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({ 
  connectionString: 'postgresql://postgres:postgres@127.0.0.1:5432/jansamvaad' 
});

async function main() {
  try {
    const hash = await bcrypt.hash('operator', 10);
    // Insert into Prisma's "User" table
    await pool.query(`
      INSERT INTO "User" (id, email, password, name, role, "updatedAt") 
      VALUES ($1, $2, $3, $4, $5, NOW())
      ON CONFLICT (email) DO NOTHING
    `, ['admin_cuid_123', 'operator', hash, 'Admin Operator', 'ADMIN']);
    
    console.log('Admin seeded directly into "User" table.');
  } catch (err) {
    console.error('Failed to seed:', err);
  } finally {
    await pool.end();
  }
}

main();
