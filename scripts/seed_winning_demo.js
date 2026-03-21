
const { Pool } = require('pg');
const crypto = require('crypto');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/jansamvaad'
});

async function seed() {
  console.log('Seeding "Winning" Demo Data...');
  
  try {
    // Clear existing (optional - maybe just add more)
    // await pool.query('TRUNCATE tickets, contacts RESTART IDENTITY CASCADE');

    const demoTickets = [
      {
        phone: '+919988776655',
        category: 'Sanitation',
        severity: 'Critical',
        summary: 'Massive garbage heap near Ward 4 primary school causing health concerns.',
        evidence_url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=800',
        lat: 28.6250,
        lon: 77.2100,
        address: 'Ward 4, Near Govt School, Delhi'
      },
      {
        phone: '+919812345678',
        category: 'Water supply',
        severity: 'High',
        summary: 'Main pipeline burst near Central Park, water flooding the street.',
        evidence_url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
        lat: 28.6139,
        lon: 77.2090,
        address: 'Central Park Circular Road, Delhi'
      },
      {
        phone: '+919765432109',
        category: 'Road Damage',
        severity: 'Medium',
        summary: 'Deep pothole emerging after recent rains on MG Road.',
        evidence_url: 'https://images.unsplash.com/photo-1596450514735-372a297779f6?auto=format&fit=crop&q=80&w=800',
        lat: 28.6300,
        lon: 77.2200,
        address: 'MG Road, Pillar 142, New Delhi'
      }
    ];

    for (const t of demoTickets) {
      // 1. Ensure contact
      const contactRes = await pool.query(
        'INSERT INTO contacts (phone) VALUES ($1) ON CONFLICT (phone) DO UPDATE SET phone = EXCLUDED.phone RETURNING id',
        [t.phone]
      );
      const contactId = contactRes.rows[0].id;

      // 2. Generate Ref
      const ref = `JS-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

      // 3. Insert Ticket
      await pool.query(
        `INSERT INTO tickets (
          contact_id, ref, category, severity, status, translated_text, 
          latitude, longitude, geo_address, evidence_url, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW() - INTERVAL '2 hours')`,
        [contactId, ref, t.category, t.severity, 'open', t.summary, t.lat, t.lon, t.address, t.evidence_url]
      );
    }

    console.log('Successfully seeded winning demo data!');
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    await pool.end();
  }
}

seed();
