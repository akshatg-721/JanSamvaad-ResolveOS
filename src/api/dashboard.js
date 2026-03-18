const express = require('express');
const pool = require('../db');
const authenticateToken = require('../middleware/authenticateToken');
const logger = require('../utils/logger');

const router = express.Router();

function maskPhone(phone) {
  if (!phone || phone.length < 4) {
    return phone || null;
  }

  const normalized = String(phone);
  const prefix = normalized.startsWith('+91') ? '+91' : normalized.slice(0, 2);
  const suffix = normalized.slice(-4);
  return `${prefix}******${suffix}`;
}

router.get('/api/tickets', authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT
         t.id,
         t.ref,
         t.category,
         t.severity,
         t.status,
         t.sla_deadline,
         t.evidence_url,
         t.created_at,
         c.phone,
         w.id AS ward_id
       FROM tickets t
       LEFT JOIN contacts c ON c.id = t.contact_id
       LEFT JOIN wards w ON w.id = t.ward_id
       ORDER BY t.created_at DESC
       LIMIT 50`
    );

    const tickets = rows.map((row) => ({
      id: row.id,
      ref: row.ref,
      category: row.category,
      ward_id: row.ward_id,
      severity: row.severity,
      status: row.status,
      sla_deadline: row.sla_deadline,
      created_at: row.created_at,
      evidence_url: row.evidence_url,
      phone: maskPhone(row.phone)
    }));

    res.json(tickets);
  } catch (error) {
    (req.log || logger).error({ err: error }, 'Failed to fetch tickets');
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
      `SELECT id, ref, created_at, category, status, severity, phone FROM tickets ORDER BY created_at DESC LIMIT 50`
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
    const { rows: tickets } = await pool.query('SELECT * FROM tickets');
    
    // Aggregations in memory for simplicity scaling
    const categoryTrend = Object.entries(
      tickets.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + 1;
        return acc;
      }, {})
    ).map(([cat, count], i) => {
      const colors = ['var(--blue)', 'var(--red)', 'var(--green)', 'var(--orange)', 'var(--purple)', 'var(--teal)'];
      return { cat, count, color: colors[i % colors.length] };
    }).sort((a,b) => b.count - a.count);

    const hourlyCounts = Array(24).fill(0);
    tickets.forEach(t => {
      const hr = new Date(t.created_at).getHours();
      hourlyCounts[hr]++;
    });
    const hourlyData = hourlyCounts.map((count, i) => ({
      hour: String(i).padStart(2, '0'),
      count
    }));

    const wardStatsMap = tickets.reduce((acc, t) => {
      const wid = t.ward_id || 0;
      if (!acc[wid]) {
        acc[wid] = { ward: `Ward ${String(wid).padStart(2,'0')}`, name: `Ward ${wid}`, open: 0, resolved: 0, critical: 0, inProgress: 0, rawHrs: 0, satisfaction: 80 };
      }
      const isResolved = t.status === 'resolved' || t.status === 'closed';
      if (isResolved) acc[wid].resolved++;
      else if (t.status === 'in-progress') acc[wid].inProgress++;
      else acc[wid].open++;
      
      if (t.severity === 'Critical' && !isResolved) acc[wid].critical++;
      return acc;
    }, {});
    
    const wardStats = Object.values(wardStatsMap).map((w) => ({
      ...w,
      avgResolutionHrs: w.resolved > 0 ? 5.2 : 0, // Simplified placeholder for actual time diffs
      citizenSatisfaction: Math.min(100, 80 + (w.resolved * 2) - (w.critical * 5))
    }));

    const dayCounts = { Mon: { i: 0, r: 0, b:0 }, Tue: { i: 0, r: 0, b:0 }, Wed: { i: 0, r: 0, b:0 }, Thu: { i: 0, r: 0, b:0 }, Fri: { i: 0, r: 0, b:0 }, Sat: { i: 0, r: 0, b:0 }, Sun: { i: 0, r: 0, b:0 } };
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    tickets.forEach(t => {
      const dName = days[new Date(t.created_at).getDay()];
      dayCounts[dName].i++;
      if (t.status === 'resolved' || t.status === 'closed') dayCounts[dName].r++;
      if (t.status !== 'resolved' && t.sla_deadline && new Date(t.sla_deadline) < new Date()) dayCounts[dName].b++;
    });
    const trendData = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => ({
      day: d, intake: dayCounts[d].i, resolved: dayCounts[d].r, breached: dayCounts[d].b
    }));

    const slaPerformance = [
      { week: 'W-4', onTime: 85, breached: 15 },
      { week: 'W-3', onTime: 88, breached: 12 },
      { week: 'W-2', onTime: 90, breached: 10 },
      { week: 'W-1', onTime: 92, breached: 8 }
    ];

    res.json({
      categoryTrend,
      hourlyData,
      wardStats,
      trendData,
      slaPerformance
    });
  } catch (error) {
    (req.log || logger).error({ err: error }, 'Failed to fetch analytics');
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
