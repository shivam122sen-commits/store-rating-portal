const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { validateSignupOrUser } = require('../middleware/validator');
const { authenticateToken } = require('../middleware/auth');

// Single Login for all roles
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(400).json({ error: 'Invalid credentials.' });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials.' });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Normal User Signup
router.post('/signup', validateSignupOrUser, async (req, res) => {
  const { name, email, password, address } = req.body;
  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) return res.status(400).json({ error: 'Email already exists.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password, address, role) 
       VALUES ($1, $2, $3, $4, 'Normal User') RETURNING id, name, email, role, address`,
      [name, email, hashedPassword, address]
    );

    res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Password update for logged-in user
router.put('/update-password', authenticateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({ error: 'New password does not meet complexity requirements.' });
  }

  try {
    const userRes = await pool.query('SELECT password FROM users WHERE id = $1', [req.user.id]);
    const match = await bcrypt.compare(oldPassword, userRes.rows[0].password);
    if (!match) return res.status(400).json({ error: 'Current password is incorrect.' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, req.user.id]);
    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;