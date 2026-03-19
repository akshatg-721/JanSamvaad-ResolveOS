const express = require('express');
const pool = require('../db');
const authenticateToken = require('../middleware/authenticateToken');
const logger = require('../utils/logger');

const router = express.Router();

// Middleware to check for Admin role
async function isAdmin(req, res, next) {
  // Simple check: for now, we'll assume the operator login from .env is the admin
  // In a real multi-user system, we would check user.role from DB
  if (req.user && req.user.username === process.env.OPERATOR_USERNAME) {
    return next();
  }
  return res.status(403).json({ error: 'Administrative privileges required' });
}

// Manage Wards
router.get('/api/admin/wards', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM wards ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch wards' });
  }
});

router.post('/api/admin/wards', authenticateToken, isAdmin, async (req, res) => {
  const { name, boundary_geojson } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO wards (name, boundary) VALUES ($1, ST_GeomFromGeoJSON($2)) RETURNING *',
      [name, boundary_geojson]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create ward: ' + err.message });
  }
});

// System Audit Logs
router.get('/api/admin/audit', authenticateToken, isAdmin, async (req, res) => {
  try {
    // In a real system, we'd have an audit_logs table
    // For now, let's return some system stats as a placeholder
    const { rows } = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM tickets) as total_tickets,
        (SELECT COUNT(*) FROM contacts) as total_users,
        (SELECT COUNT(*) FROM tickets WHERE status = 'closed') as resolved_count
    `);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Audit failed' });
  }
});

module.exports = router;
