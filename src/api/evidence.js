const express = require('express');
const { z } = require('zod');
const crypto = require('crypto');
const twilio = require('twilio');
const pool = require('../db');
const authenticateToken = require('../middleware/authenticateToken');
const logger = require('../utils/logger');

const router = express.Router();

// ── Twilio setup ─────────────────────────────────────────────────────────────
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioFromNumber = process.env.TWILIO_PHONE_NUMBER;
const twilioClient = twilioAccountSid && twilioAuthToken
  ? twilio(twilioAccountSid, twilioAuthToken)
  : null;

// ── Validation schemas ────────────────────────────────────────────────────────
const uploadSchema = z.object({
  ticket_id: z.coerce.number().int().positive({ message: 'ticket_id must be a positive integer' })
});

const resolveSchema = z.object({
  token: z.string().optional(),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  text: z.string().max(1000).optional()
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function generateEvidenceHash(seed) {
  return crypto.createHash('sha256').update(`${seed}:${new Date().toISOString()}`).digest('hex');
}

function buildEvidenceUploadUrl(hash) {
  const evidenceBaseUrl = (process.env.EVIDENCE_BASE_URL || process.env.APP_BASE_URL || '').replace(/\/$/, '');
  if (!evidenceBaseUrl) {
    logger.warn('EVIDENCE_BASE_URL and APP_BASE_URL are not set. Evidence URLs will be relative.');
    return `/evidence/${hash}`;
  }
  return `${evidenceBaseUrl}/evidence/${hash}`;
}

// ── POST /api/evidence/upload ─────────────────────────────────────────────────
router.post('/api/evidence/upload', authenticateToken, async (req, res, next) => {
  try {
    const { ticket_id: ticketId } = uploadSchema.parse(req.body);
    const evidenceHash = generateEvidenceHash(`evidence-upload:${ticketId}`);
    const uploadUrl = buildEvidenceUploadUrl(evidenceHash);

    const { rows } = await pool.query(
      `UPDATE tickets
       SET evidence_url = $2
       WHERE id = $1
       RETURNING id, ref, category, ward_id, severity, status, sla_deadline, created_at, closed_at, evidence_url`,
      [ticketId, uploadUrl]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Ticket not found' });

    res.json({ hash: evidenceHash, url: uploadUrl, ticket_id: ticketId, ticket: rows[0] });
  } catch (error) {
    if (error.name === 'ZodError') return res.status(422).json({ error: 'Validation failed', details: error.errors });
    (req.log || logger).error({ err: error }, 'Failed to generate evidence upload URL');
    next(error);
  }
});

// ── POST /api/tickets/:id/resolve ─────────────────────────────────────────────
// This is the SINGLE authoritative resolve endpoint (with transaction + SMS notification)
router.post('/api/tickets/:id/resolve', authenticateToken, async (req, res, next) => {
  const ticketId = Number(req.params.id);
  if (!Number.isInteger(ticketId) || ticketId <= 0) {
    return res.status(422).json({ error: 'Invalid ticket id' });
  }

  let body = {};
  try {
    body = resolveSchema.parse(req.body);
  } catch (error) {
    return res.status(422).json({ error: 'Validation failed', details: error.errors });
  }

  const dbClient = await pool.connect();
  let transactionStarted = false;

  try {
    await dbClient.query('BEGIN');
    transactionStarted = true;

    const ticketResult = await dbClient.query(
      `SELECT t.id, t.ref, t.status, t.evidence_url, c.phone
       FROM tickets t
       JOIN contacts c ON c.id = t.contact_id
       WHERE t.id = $1 LIMIT 1`,
      [ticketId]
    );

    if (ticketResult.rows.length === 0) {
      await dbClient.query('ROLLBACK');
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const ticket = ticketResult.rows[0];
    if (!ticket.phone) {
      await dbClient.query('ROLLBACK');
      return res.status(400).json({ error: 'Citizen phone number not available for this ticket' });
    }

    const resolutionHash = generateEvidenceHash(`ticket-resolve:${ticket.ref}`);
    const fallbackUploadUrl = buildEvidenceUploadUrl(resolutionHash);

    const updatedTicketResult = await dbClient.query(
      `UPDATE tickets
       SET status = 'closed',
           closed_at = NOW(),
           evidence_url = COALESCE(evidence_url, $2),
           feedback_rating = COALESCE($3, feedback_rating),
           feedback_text = COALESCE($4, feedback_text),
           resolve_token = NULL
       WHERE id = $1
       RETURNING id, ref, category, ward_id, severity, status, sla_deadline, created_at, closed_at, evidence_url, feedback_rating`,
      [ticketId, fallbackUploadUrl, body.rating || null, body.text || null]
    );

    const updatedTicket = updatedTicketResult.rows[0];

    // Send Twilio SMS if available
    if (twilioClient && twilioFromNumber) {
      const appBaseUrl = (process.env.APP_BASE_URL || '').replace(/\/$/, '');
      const resolutionCardUrl = appBaseUrl ? `${appBaseUrl}/card/${resolutionHash}` : `/card/${resolutionHash}`;
      const evidenceUploadUrl = updatedTicket.evidence_url || fallbackUploadUrl;
      try {
        await twilioClient.messages.create({
          to: ticket.phone,
          from: twilioFromNumber,
          body: `JanSamvaad Update: Your ticket ${ticket.ref} is resolved. Evidence: ${evidenceUploadUrl}. Resolution Card: ${resolutionCardUrl}`
        });
      } catch (smsError) {
        // SMS failure is non-fatal — log and continue
        (req.log || logger).warn({ err: smsError, ticketId }, 'SMS notification failed but ticket resolved');
      }
    } else {
      (req.log || logger).warn({ ticketId }, 'Twilio not configured — SMS notification skipped');
    }

    await dbClient.query('COMMIT');
    transactionStarted = false;

    // Emit real-time update
    if (req.io) req.io.emit('ticket_resolved', updatedTicket);

    res.json(updatedTicket);
  } catch (error) {
    if (transactionStarted) await dbClient.query('ROLLBACK');
    (req.log || logger).error({ err: error, ticketId }, 'Failed to resolve ticket');
    next(error);
  } finally {
    dbClient.release();
  }
});

module.exports = router;
