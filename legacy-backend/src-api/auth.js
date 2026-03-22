const express = require('express');
const { z } = require('zod');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../db');
const logger = require('../utils/logger');

const router = express.Router();

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required').max(50),
  password: z.string().min(1, 'Password is required').max(128)
});

router.post('/api/auth/login', async (req, res, next) => {
  try {
    const { username, password } = loginSchema.parse(req.body);

    const { rows } = await pool.query(
      'SELECT id, username, password_hash, role FROM users WHERE username = $1',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      logger.error('JWT_SECRET is not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      secret,
      { expiresIn: '8h' }
    );

    logger.info({ username: user.username, role: user.role }, 'User authenticated');
    res.json({ token, username: user.username, role: user.role });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(422).json({ error: 'Validation failed', details: error.errors });
    }
    (req.log || logger).error({ err: error }, 'Login error');
    next(error);
  }
});

module.exports = router;
