const crypto = require('crypto');
const pool = require('../db');

let _io = null;

function setIo(ioInstance) {
  _io = ioInstance;
}

function generateTicketRef() {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let suffix = '';

  for (let i = 0; i < 6; i += 1) {
    const index = crypto.randomInt(0, charset.length);
    suffix += charset[index];
  }

  return `JS-${suffix}`;
}

function getSlaDeadline(severity) {
  const now = new Date();
  const hoursBySeverity = {
    High: 12,
    Medium: 24,
    Low: 48
  };
  const hours = hoursBySeverity[severity] || 24;
  const deadline = new Date(now.getTime() + hours * 60 * 60 * 1000);
  return deadline;
}

function isSlaBreached(slaDeadline) {
  if (!slaDeadline) {
    return false;
  }

  const deadlineTime = new Date(slaDeadline).getTime();
  if (!Number.isFinite(deadlineTime)) {
    return false;
  }

  return deadlineTime < Date.now();
}

async function createTicket(phone, grievanceData) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Basic Duplicate Ticket Detection (within 1 hour for same contact and category)
    const duplicateCheckResult = await client.query(
      `SELECT id FROM tickets 
       WHERE contact_id = (SELECT id FROM contacts WHERE phone = $1)
       AND category = $2 
       AND status = 'open' 
       AND created_at > NOW() - INTERVAL '1 hour'
       LIMIT 1`,
      [phone, grievanceData.category]
    );

    if (duplicateCheckResult.rows.length > 0) {
      if (_io) {
        _io.emit('duplicate_ticket', { existingTicketId: duplicateCheckResult.rows[0].id, category: grievanceData.category });
      }
      throw new Error(`Duplicate ticket detected for ${phone} and category ${grievanceData.category} within the last hour.`);
    }

    const existingContactResult = await client.query(
      'SELECT id FROM contacts WHERE phone = $1 LIMIT 1',
      [phone]
    );

    let contactId;

    if (existingContactResult.rows.length > 0) {
      contactId = existingContactResult.rows[0].id;
    } else {
      const insertContactResult = await client.query(
        'INSERT INTO contacts (phone, consent, dnd) VALUES ($1, $2, $3) RETURNING id',
        [phone, true, false]
      );
      contactId = insertContactResult.rows[0].id;
    }

    const ref = generateTicketRef();
    const slaDeadline = getSlaDeadline(grievanceData.severity);

    const insertTicketResult = await client.query(
      `INSERT INTO tickets (
        contact_id, ref, category, ward_id, severity, status, sla_deadline,
        sentiment, frustration_level, detected_language, translated_text,
        latitude, longitude, geo_address, location_accuracy, nearby_landmarks,
        weather_condition, temperature, weather_boosted, evidence_url
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING *`,
      [
        contactId,
        ref,
        grievanceData.category,
        grievanceData.ward_id,
        grievanceData.severity,
        'open',
        slaDeadline,
        grievanceData.sentiment || null,
        grievanceData.frustration_level || null,
        grievanceData.detected_language || null,
        grievanceData.translated_text || null,
        grievanceData.latitude || null,
        grievanceData.longitude || null,
        grievanceData.geo_address || null,
        grievanceData.location_accuracy || null,
        grievanceData.nearby_landmarks || null,
        grievanceData.weather_condition || null,
        grievanceData.temperature || null,
        grievanceData.weather_boosted || false,
        grievanceData.evidence_url || null
      ]
    );

    const createdTicket = insertTicketResult.rows[0];
    await client.query('COMMIT');
    if (_io) {
      _io.emit('new_ticket', createdTicket);
    }
    return createdTicket;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  createTicket,
  getSlaDeadline,
  isSlaBreached,
  setIo
};
