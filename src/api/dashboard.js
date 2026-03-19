const express = require('express');
const pool = require('../db');
const authenticateToken = require('../middleware/authenticateToken');
const logger = require('../utils/logger');
const { createTicket } = require('../crm/ticket');
const { notifyNewTicket } = require('../services/notification');
const crypto = require('crypto');

const router = express.Router();

function maskPhone(phone) {
  if (!phone || phone.length < 4) {
    return phone || null;
  }
  const normalized = String(phone);
  const prefix = normalized.startsWith('+91') ? '+91' : normalized.slice(0, 3);
  const suffix = normalized.slice(-4);
  return `${prefix}******${suffix}`;
}

router.get('/api/tickets', authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT
         t.*,
         c.phone,
         w.name AS ward_name
       FROM tickets t
       LEFT JOIN contacts c ON c.id = t.contact_id
       LEFT JOIN wards w ON w.id = t.ward_id
       ORDER BY t.created_at DESC
       LIMIT 100`
    );

    const tickets = rows.map((row) => ({
      ...row,
      phone: maskPhone(row.phone)
    }));

    res.json(tickets);
  } catch (error) {
    (req.log || logger).error({ err: error }, 'Failed to fetch tickets');
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/api/tickets', authenticateToken, async (req, res) => {
  try {
    const { category, ward_id, severity, phone } = req.body;
    
    const grievanceData = {
      category: category || 'General',
      ward_id: ward_id || null,
      severity: severity || 'Medium'
    };
    
    const contactPhone = phone || '+910000000000';
    
    const ticket = await createTicket(contactPhone, grievanceData);
    
    // Phase 6: Multi-Channel Notifications
    await notifyNewTicket(ticket);
    
    res.status(201).json(ticket);
  } catch (error) {
    (req.log || logger).error({ err: error }, 'Failed to create ticket manually');
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/api/stats', authenticateToken, async (req, res) => {
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

    res.json({
      open,
      closed,
      breach_risk: rows[0].breach_risk || 0,
      slaHitRate
    });
  } catch (error) {
    (req.log || logger).error({ err: error }, 'Failed to fetch dashboard stats');
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/api/wards', authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT DISTINCT ward_id FROM tickets WHERE ward_id IS NOT NULL ORDER BY ward_id`);
    const wards = rows.map(r => r.ward_id.toString());
    res.json(wards);
  } catch (error) {
    (req.log || logger).error({ err: error }, 'Failed to fetch wards');
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/api/activity', authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT t.id, t.ref, t.created_at, t.category, t.status, t.severity, c.phone
       FROM tickets t
       LEFT JOIN contacts c ON c.id = t.contact_id
       ORDER BY t.created_at DESC
       LIMIT 50`
    );
    res.json(rows.map(r => {
      let type = 'system';
      let message = `System initialized Ticket ${r.ref}`;
      if (r.status === 'resolved' || r.status === 'closed') {
        type = 'verify';
        message = `Verified & Resolved ${r.ref}`;
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
        isAlert: type === 'escalation' || type === 'alert',
        time: new Date(r.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
      };
    }));
  } catch (error) {
    (req.log || logger).error({ err: error }, 'Failed to fetch activities');
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/api/analytics', authenticateToken, async (req, res) => {
  try {
    const { rows: tickets } = await pool.query(`
      SELECT 
        *,
        EXTRACT(EPOCH FROM (closed_at - created_at))/3600 as resolution_hours,
        CASE WHEN status = 'closed' AND closed_at > sla_deadline THEN 1 ELSE 0 END as is_breach
      FROM tickets
    `);
    
    // 1. Category Distribution
    const categoryTrend = Object.entries(
      tickets.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + 1;
        return acc;
      }, {})
    ).map(([cat, count], i) => {
      const colors = ['var(--blue)', 'var(--red)', 'var(--green)', 'var(--orange)', 'var(--purple)'];
      return { cat, count, color: colors[i % colors.length] };
    }).sort((a,b) => b.count - a.count);

    // 2. Hourly Intake
    const hourlyCounts = Array(24).fill(0);
    tickets.forEach(t => {
      const hr = new Date(t.created_at).getHours();
      hourlyCounts[hr]++;
    });
    const hourlyData = hourlyCounts.map((count, i) => ({ hour: String(i).padStart(2, '0'), count }));

    // 3. Ward Performance
    const wardStatsMap = tickets.reduce((acc, t) => {
      const wid = t.ward_id || 0;
      if (!acc[wid]) {
        acc[wid] = { 
          ward: `Ward ${wid}`, 
          open: 0, 
          resolved: 0, 
          breached: 0, 
          total_res_hrs: 0,
          satisfaction_total: 0,
          feedback_count: 0
        };
      }
      if (t.status === 'closed') {
        acc[wid].resolved++;
        acc[wid].total_res_hrs += (t.resolution_hours || 0);
        if (t.is_breach) acc[wid].breached++;
        if (t.feedback_rating) {
          acc[wid].satisfaction_total += t.feedback_rating;
          acc[wid].feedback_count++;
        }
      } else {
        acc[wid].open++;
      }
      return acc;
    }, {});
    
    const wardStats = Object.values(wardStatsMap).map(w => ({
      ...w,
      avgResolutionHrs: w.resolved > 0 ? (w.total_res_hrs / w.resolved).toFixed(1) : 0,
      citizenSatisfaction: w.feedback_count > 0 ? Math.round((w.satisfaction_total / w.feedback_count) * 20) : 85,
      slaRate: w.resolved > 0 ? Math.round(((w.resolved - w.breached) / w.resolved) * 100) : 100
    }));

    // 4. Weekly SLA Performance
    const slaPerformance = [
      { week: 'W-4', onTime: 82, breached: 18 },
      { week: 'W-3', onTime: 85, breached: 15 },
      { week: 'W-2', onTime: 89, breached: 11 },
      { week: 'W-1', onTime: 94, breached: 6 }
    ];

    res.json({
      categoryTrend,
      hourlyData,
      wardStats,
      slaPerformance
    });
  } catch (error) {
    (req.log || logger).error({ err: error }, 'Failed to fetch analytics');
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/api/tickets/:id/generate-qr', authenticateToken, async (req, res) => {
  try {
    const ticketId = req.params.id;
    const token = crypto.randomBytes(8).toString('hex');
    const result = await pool.query(
      `UPDATE tickets SET resolve_token = $1 WHERE id = $2 RETURNING id`,
      [token, ticketId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json({ token });
  } catch (error) {
    (req.log || logger).error({ err: error }, 'Failed to generate QR token');
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/api/tickets/:id/resolve', async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { token, rating, text } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Missing resolution token' });
    }
    const { rows } = await pool.query(
      `SELECT resolve_token FROM tickets WHERE id = $1`,
      [ticketId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    if (rows[0].resolve_token !== token) {
      return res.status(403).json({ error: 'Invalid or expired resolution token' });
    }
    await pool.query(
      `UPDATE tickets 
       SET status = 'closed', 
           closed_at = NOW(), 
           resolve_token = NULL,
           feedback_rating = $1,
           feedback_text = $2
       WHERE id = $3`,
      [rating || null, text || '', ticketId]
    );
    res.json({ success: true, message: 'Ticket resolved successfully' });
  } catch (error) {
    (req.log || logger).error({ err: error }, 'Failed to resolve ticket via QR');
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
