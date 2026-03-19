const express = require('express');
const pool = require('../db');
const logger = require('../utils/logger');

const router = express.Router();

// Publicly viewable live stats
router.get('/api/public/stats', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'closed') as resolved,
        AVG(EXTRACT(EPOCH FROM (closed_at - created_at))/3600)::numeric(10,1) as avg_resolution_hrs
      FROM tickets
    `);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

// Anonymized live feed for transparency
router.get('/api/public/feed', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        ref, category, status, created_at, geo_address
      FROM tickets
      ORDER BY created_at DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

module.exports = router;
