const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../db');

const router = express.Router();

router.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body || {};
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return res.status(500).json({ error: 'Server misconfiguration: auth env vars not set' });
  }

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' });
  }

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE username = $1 LIMIT 1', [username]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userResult.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      jwtSecret,
      { expiresIn: '8h' }
    );

    res.json({ token, role: user.role });
  } catch (error) {
    req.log?.error({ err: error }, 'Login error');
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

module.exports = router;
