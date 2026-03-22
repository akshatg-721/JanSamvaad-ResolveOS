const express = require('express');
const { z } = require('zod');
const pool = require('../db');
const authenticateToken = require('../middleware/authenticateToken');
const logger = require('../utils/logger');
const { createTicket } = require('../crm/ticket');
const { notifyNewTicket } = require('../services/notification');
const crypto = require('crypto');

const router = express.Router();

// ── Validation schemas ──────────────────────────────────────────────────────
const createTicketSchema = z.object({
  category: z.string().min(1).max(50).optional().default('General'),
  ward_id: z.number().int().positive().nullable().optional(),
  severity: z.enum(['Critical', 'High', 'Medium', 'Low']).optional().default('Medium'),
  phone: z.string().optional()
});

const ticketQuerySchema = z.object({
  status: z.enum(['open', 'in_progress', 'in-progress', 'resolved', 'closed', 'all']).optional(),
  severity: z.enum(['Critical', 'High', 'Medium', 'Low', 'all']).optional(),
  limit: z.coerce.number().int().min(1).max(200).optional().default(100)
});

// ── Helpers ─────────────────────────────────────────────────────────────────
function maskPhone(phone) {
  if (!phone || phone.length < 4) return phone || null;
  const normalized = String(phone);
  const prefix = normalized.startsWith('+91') ? '+91' : normalized.slice(0, 3);
  const suffix = normalized.slice(-4);
  return `${prefix}******${suffix}`;
}

// ── GET /api/tickets ─────────────────────────────────────────────────────────
router.get('/api/tickets', authenticateToken, async (req, res, next) => {
  try {
    const query = ticketQuerySchema.parse(req.query);
    const conditions = [];
    const params = [];

    if (query.status && query.status !== 'all') {
      params.push(query.status);
      conditions.push(`t.status = $${params.length}`);
    }
    if (query.severity && query.severity !== 'all') {
      params.push(query.severity);
      conditions.push(`t.severity = $${params.length}`);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    params.push(query.limit);

    const { rows } = await pool.query(
      `SELECT
         t.*,
         c.phone,
         w.name AS ward_name
       FROM tickets t
       LEFT JOIN contacts c ON c.id = t.contact_id
       LEFT JOIN wards w ON w.id = t.ward_id
       ${where}
       ORDER BY t.created_at DESC
       LIMIT $${params.length}`,
      params
    );

    const tickets = rows.map((row) => ({ ...row, phone: maskPhone(row.phone) }));
    res.json(tickets);
  } catch (error) {
    if (error.name === 'ZodError') return res.status(422).json({ error: 'Invalid query parameters', details: error.errors });
    (req.log || logger).error({ err: error }, 'Failed to fetch tickets');
    next(error);
  }
});

// ── POST /api/tickets ────────────────────────────────────────────────────────
router.post('/api/tickets', authenticateToken, async (req, res, next) => {
  try {
    const body = createTicketSchema.parse(req.body);
    const grievanceData = {
      category: body.category,
      ward_id: body.ward_id || null,
      severity: body.severity
    };
    const contactPhone = body.phone || '+910000000000';
    const ticket = await createTicket(contactPhone, grievanceData);
    await notifyNewTicket(ticket);
    res.status(201).json(ticket);
  } catch (error) {
    if (error.name === 'ZodError') return res.status(422).json({ error: 'Validation failed', details: error.errors });
    (req.log || logger).error({ err: error }, 'Failed to create ticket manually');
    next(error);
  }
});

// ── GET /api/stats ───────────────────────────────────────────────────────────
router.get('/api/stats', authenticateToken, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT
         COUNT(*) FILTER (WHERE status = 'open')::int AS open,
         COUNT(*) FILTER (WHERE status = 'closed')::int AS closed,
         COUNT(*) FILTER (
           WHERE status = 'open'
             AND sla_deadline <= NOW() + INTERVAL '12 hours'
         )::int AS breach_risk
       FROM tickets`
    );

    const open = rows[0].open || 0;
    const closed = rows[0].closed || 0;
    const total = open + closed;
    const slaHitRate = total === 0 ? '100.0%' : `${((closed / total) * 100).toFixed(1)}%`;

    res.json({ open, closed, breach_risk: rows[0].breach_risk || 0, slaHitRate });
  } catch (error) {
    (req.log || logger).error({ err: error }, 'Failed to fetch dashboard stats');
    next(error);
  }
});

// ── GET /api/wards ───────────────────────────────────────────────────────────
router.get('/api/wards', authenticateToken, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT DISTINCT ward_id FROM tickets WHERE ward_id IS NOT NULL ORDER BY ward_id`
    );
    res.json(rows.map((r) => r.ward_id.toString()));
  } catch (error) {
    (req.log || logger).error({ err: error }, 'Failed to fetch wards');
    next(error);
  }
});

// ── GET /api/activity ────────────────────────────────────────────────────────
router.get('/api/activity', authenticateToken, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT t.id, t.ref, t.created_at, t.category, t.status, t.severity, c.phone
       FROM tickets t
       LEFT JOIN contacts c ON c.id = t.contact_id
       ORDER BY t.created_at DESC
       LIMIT 50`
    );
    res.json(rows.map((r) => {
      let type = 'system';
      let message = `Ticket ${r.ref} registered`;
      if (r.status === 'resolved' || r.status === 'closed') {
        type = 'verify';
        message = `Resolved: ${r.ref}`;
      } else if (r.severity === 'Critical') {
        type = 'escalation';
        message = `Critical alert: ${r.ref} (${r.category})`;
      } else {
        type = 'voice';
        message = `Voice Intake: ${r.ref} (${r.category})`;
      }
      return {
        id: String(r.id),
        type,
        message,
        isAlert: type === 'escalation',
        phone: maskPhone(r.phone),
        time: new Date(r.created_at).toLocaleTimeString('en-IN', {
          hour: '2-digit', minute: '2-digit', hour12: false
        }),
      };
    }));
  } catch (error) {
    (req.log || logger).error({ err: error }, 'Failed to fetch activities');
    next(error);
  }
});

// ── GET /api/analytics ───────────────────────────────────────────────────────
router.get('/api/analytics', authenticateToken, async (req, res, next) => {
  try {
    const { rows: tickets } = await pool.query(`
      SELECT 
        *,
        EXTRACT(EPOCH FROM (closed_at - created_at))/3600 as resolution_hours,
        CASE WHEN status = 'closed' AND closed_at > sla_deadline THEN 1 ELSE 0 END as is_breach
      FROM tickets
    `);

    const categoryTrend = Object.entries(
      tickets.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + 1;
        return acc;
      }, {})
    ).map(([cat, count], i) => {
      const colors = ['var(--blue)', 'var(--red)', 'var(--green)', 'var(--orange)', 'var(--purple)'];
      return { cat, count, color: colors[i % colors.length] };
    }).sort((a, b) => b.count - a.count);

    const hourlyCounts = Array(24).fill(0);
    tickets.forEach((t) => { hourlyCounts[new Date(t.created_at).getHours()]++; });
    const hourlyData = hourlyCounts.map((count, i) => ({ hour: String(i).padStart(2, '0'), count }));

    const wardStatsMap = tickets.reduce((acc, t) => {
      const wid = t.ward_id || 0;
      if (!acc[wid]) {
        acc[wid] = { ward: `Ward ${wid}`, open: 0, resolved: 0, breached: 0, total_res_hrs: 0, satisfaction_total: 0, feedback_count: 0 };
      }
      if (t.status === 'closed') {
        acc[wid].resolved++;
        acc[wid].total_res_hrs += (t.resolution_hours || 0);
        if (t.is_breach) acc[wid].breached++;
        if (t.feedback_rating) { acc[wid].satisfaction_total += t.feedback_rating; acc[wid].feedback_count++; }
      } else {
        acc[wid].open++;
      }
      return acc;
    }, {});

    const wardStats = Object.values(wardStatsMap).map((w) => ({
      ...w,
      avgResolutionHrs: w.resolved > 0 ? (w.total_res_hrs / w.resolved).toFixed(1) : 0,
      citizenSatisfaction: w.feedback_count > 0 ? Math.round((w.satisfaction_total / w.feedback_count) * 20) : 85,
      slaRate: w.resolved > 0 ? Math.round(((w.resolved - w.breached) / w.resolved) * 100) : 100
    }));

    const slaPerformance = [
      { week: 'W-4', onTime: 82, breached: 18 },
      { week: 'W-3', onTime: 85, breached: 15 },
      { week: 'W-2', onTime: 89, breached: 11 },
      { week: 'W-1', onTime: 94, breached: 6 }
    ];

    res.json({ categoryTrend, hourlyData, wardStats, slaPerformance });
  } catch (error) {
    (req.log || logger).error({ err: error }, 'Failed to fetch analytics');
    next(error);
  }
});

// ── POST /api/tickets/:id/generate-qr ────────────────────────────────────────
router.post('/api/tickets/:id/generate-qr', authenticateToken, async (req, res, next) => {
  try {
    const ticketId = z.coerce.number().int().positive().parse(req.params.id);
    const token = crypto.randomBytes(8).toString('hex');
    const result = await pool.query(
      `UPDATE tickets SET resolve_token = $1 WHERE id = $2 RETURNING id`,
      [token, ticketId]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Ticket not found' });
    res.json({ token });
  } catch (error) {
    if (error.name === 'ZodError') return res.status(422).json({ error: 'Invalid ticket id' });
    (req.log || logger).error({ err: error }, 'Failed to generate QR token');
    next(error);
  }
});

// NOTE: POST /api/tickets/:id/resolve is intentionally NOT here.
// The authoritative resolve endpoint (with Twilio notification + transaction) lives in src/api/evidence.js

module.exports = router;
