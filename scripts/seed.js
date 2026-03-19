require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const DEMO_TICKETS = [
  { ref: 'JS-W10A29', c: 'Sanitation',      w: 1, s: 'High',   st: 'open',   hrsAgo: 2,   slaHrs: 12 },
  { ref: 'JS-W10B33', c: 'Water Supply',    w: 2, s: 'High',   st: 'open',   hrsAgo: 5,   slaHrs: 6 },
  { ref: 'JS-W10C41', c: 'Road Damage',     w: 1, s: 'Medium', st: 'open',   hrsAgo: 1,   slaHrs: 24 },
  { ref: 'JS-W10D55', c: 'Electricity',     w: 3, s: 'High',   st: 'closed', hrsAgo: 24,  slaHrs: 12 },
  { ref: 'JS-W10E66', c: 'Drainage',        w: 2, s: 'Medium', st: 'open',   hrsAgo: 12,  slaHrs: 24 },
  { ref: 'JS-W10F77', c: 'Street Lighting', w: 4, s: 'Low',    st: 'open',   hrsAgo: 48,  slaHrs: 48 },
  { ref: 'JS-W10G88', c: 'Sanitation',      w: 3, s: 'High',   st: 'open',   hrsAgo: 8,   slaHrs: 12 },
  { ref: 'JS-W10H99', c: 'Public Safety',   w: 1, s: 'High',   st: 'closed', hrsAgo: 36,  slaHrs: 6 },
  { ref: 'JS-W10I10', c: 'Encroachment',    w: 2, s: 'Medium', st: 'open',   hrsAgo: 4,   slaHrs: 24 },
  { ref: 'JS-W10J11', c: 'Water Supply',    w: 5, s: 'High',   st: 'open',   hrsAgo: 1,   slaHrs: 6 },
  { ref: 'JS-W10K12', c: 'Noise Pollution', w: 4, s: 'Low',    st: 'closed', hrsAgo: 12,  slaHrs: 48 },
  { ref: 'JS-W10L13', c: 'Road Damage',     w: 1, s: 'High',   st: 'open',   hrsAgo: 6,   slaHrs: 12 },
  { ref: 'JS-W10M14', c: 'Park Maintenance',w: 3, s: 'Low',    st: 'open',   hrsAgo: 2,   slaHrs: 48 },
  { ref: 'JS-W10N15', c: 'Sanitation',      w: 2, s: 'Medium', st: 'open',   hrsAgo: 14,  slaHrs: 24 },
  { ref: 'JS-W10O16', c: 'Electricity',     w: 5, s: 'High',   st: 'open',   hrsAgo: 3,   slaHrs: 6 },
  { ref: 'JS-W10P17', c: 'Water Supply',    w: 1, s: 'High',   st: 'closed', hrsAgo: 18,  slaHrs: 12 },
  { ref: 'JS-W10Q18', c: 'Drainage',        w: 4, s: 'Medium', st: 'open',   hrsAgo: 22,  slaHrs: 24 },
  { ref: 'JS-W10R19', c: 'Encroachment',    w: 3, s: 'Low',    st: 'open',   hrsAgo: 10,  slaHrs: 48 },
  { ref: 'JS-W10S20', c: 'Street Lighting', w: 2, s: 'Medium', st: 'closed', hrsAgo: 60,  slaHrs: 24 },
  { ref: 'JS-W10T21', c: 'Sanitation',      w: 5, s: 'High',   st: 'open',   hrsAgo: 1,   slaHrs: 12 },
  { ref: 'JS-W10U22', c: 'Road Damage',     w: 4, s: 'High',   st: 'open',   hrsAgo: 5,   slaHrs: 6 },
  { ref: 'JS-W10V23', c: 'Public Safety',   w: 1, s: 'High',   st: 'open',   hrsAgo: 7,   slaHrs: 12 },
  { ref: 'JS-W10W24', c: 'Water Supply',    w: 3, s: 'Medium', st: 'open',   hrsAgo: 16,  slaHrs: 24 },
  { ref: 'JS-W10X25', c: 'Electricity',     w: 2, s: 'High',   st: 'closed', hrsAgo: 10,  slaHrs: 12 },
  { ref: 'JS-W10Y26', c: 'Sanitation',      w: 4, s: 'Low',    st: 'open',   hrsAgo: 24,  slaHrs: 48 },
];

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('Clearing old data...');
    await client.query('TRUNCATE tickets, contacts, wards RESTART IDENTITY CASCADE');
    
    console.log('Inserting Wards...');
    for (let i = 1; i <= 5; i++) {
      await client.query('INSERT INTO wards (id, name) VALUES ($1, $2)', [i, `Ward ${i}`]);
    }

    console.log('Inserting Contact...');
    const contactResult = await client.query(`INSERT INTO contacts (phone, consent, dnd) VALUES ($1, $2, $3) RETURNING id`, ['+919999999999', true, false]);
    const contactId = contactResult.rows[0].id;

    console.log('Inserting 25 realistic demo tickets...');
    for (const t of DEMO_TICKETS) {
      const created_at = new Date(Date.now() - t.hrsAgo * 60 * 60 * 1000);
      const sla_deadline = new Date(created_at.getTime() + t.slaHrs * 60 * 60 * 1000);
      
      await client.query(
        `INSERT INTO tickets (contact_id, ref, category, ward_id, severity, status, sla_deadline, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [contactId, t.ref, t.c, t.w, t.s, t.st, sla_deadline, created_at]
      );
    }
    
    await client.query('COMMIT');
    console.log('Seed successful!');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Seed failed', e);
  } finally {
    client.release();
    pool.end();
  }
}

seed();
