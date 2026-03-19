require('dotenv').config();
const pool = require('./src/db');

async function seed() {
  try {
    console.log("Seeding database with test data...");

    // 1. Seed Wards
    const wards = ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'];
    for (const ward of wards) {
      await pool.query('INSERT INTO wards (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [ward]);
    }
    console.log("Wards seeded.");

    // 2. Seed a Contact
    const contactRes = await pool.query(
      'INSERT INTO contacts (phone) VALUES ($1) ON CONFLICT (phone) DO UPDATE SET phone = EXCLUDED.phone RETURNING id',
      ['+919876543210']
    );
    const contactId = contactRes.rows[0].id;
    console.log("Contact seeded.");

    // 3. Seed Tickets
    const ticketData = [
      { category: 'Sanitation', severity: 'High', ward: 'Ward 1' },
      { category: 'Water Supply', severity: 'Medium', ward: 'Ward 2' },
      { category: 'Road Damage', severity: 'High', ward: 'Ward 3' },
      { category: 'Electricity', severity: 'Low', ward: 'Ward 4' }
    ];

    for (const data of ticketData) {
      const wardRes = await pool.query('SELECT id FROM wards WHERE name = $1', [data.ward]);
      const wardId = wardRes.rows[0].id;
      const ref = `JS-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      await pool.query(
        `INSERT INTO tickets (contact_id, ref, category, ward_id, severity, status, sla_deadline)
         VALUES ($1, $2, $3, $4, $5, 'open', NOW() + INTERVAL '24 hours')`,
        [contactId, ref, data.category, wardId, data.severity]
      );
    }
    console.log("Tickets seeded.");
    console.log("Seeding complete! Refresh your dashboard to see the tickets.");

  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    pool.end();
  }
}

seed();
