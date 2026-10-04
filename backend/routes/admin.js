const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateSignupOrUser } = require('../middleware/validator');

router.use(authenticateToken, authorizeRoles('System Administrator'));

// Dashboard stats: total users, stores, ratings
router.get('/dashboard-stats', async (req, res) => {
  try {
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    const storeCount = await pool.query('SELECT COUNT(*) FROM stores');
    const ratingCount = await pool.query('SELECT COUNT(*) FROM ratings');

    res.json({
      totalUsers: parseInt(userCount.rows[0].count),
      totalStores: parseInt(storeCount.rows[0].count),
      totalRatings: parseInt(ratingCount.rows[0].count),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add user (Admin, Normal User, or Store Owner)
router.post('/add-user', validateSignupOrUser, async (req, res) => {
  const { name, email, password, address, role } = req.body;
  if (!['System Administrator', 'Normal User', 'Store Owner'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role provided.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password, address, role) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, address, role`,
      [name, email, hashedPassword, address, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add store
router.post('/add-store', async (req, res) => {
  const { name, email, address, ownerId } = req.body;
  if (!name || !email || !address) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  if (address.length > 400) {
    return res.status(400).json({ error: 'Address must not exceed 400 characters.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO stores (name, email, address, owner_id) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email, address, ownerId || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// View all users with filters and sorting
router.get('/users', async (req, res) => {
  const { search, role, sortBy = 'name', sortOrder = 'ASC' } = req.query;
  const validSortCols = ['name', 'email', 'address', 'role'];
  const col = validSortCols.includes(sortBy) ? sortBy : 'name';
  const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  let query = `
    SELECT u.id, u.name, u.email, u.address, u.role,
           ROUND(AVG(r.rating)::numeric, 2) as store_rating
    FROM users u
    LEFT JOIN stores s ON s.owner_id = u.id
    LEFT JOIN ratings r ON r.store_id = s.id
    WHERE 1=1
  `;
  const params = [];

  if (search) {
    params.push(`%${search}%`);
    query += ` AND (u.name ILIKE $${params.length} OR u.email ILIKE $${params.length} OR u.address ILIKE $${params.length})`;
  }
  if (role) {
    params.push(role);
    query += ` AND u.role = $${params.length}`;
  }

  query += ` GROUP BY u.id ORDER BY u.${col} ${order}`;

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// View all stores with overall ratings, search & sort
router.get('/stores', async (req, res) => {
  const { search, sortBy = 'name', sortOrder = 'ASC' } = req.query;
  const validSortCols = ['name', 'email', 'address', 'rating'];
  const col = validSortCols.includes(sortBy) ? sortBy : 'name';
  const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  let query = `
    SELECT s.id, s.name, s.email, s.address,
           COALESCE(ROUND(AVG(r.rating)::numeric, 2), 0) AS rating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    WHERE 1=1
  `;
  const params = [];

  if (search) {
    params.push(`%${search}%`);
    query += ` AND (s.name ILIKE $${params.length} OR s.email ILIKE $${params.length} OR s.address ILIKE $${params.length})`;
  }

  query += ` GROUP BY s.id ORDER BY ${col === 'rating' ? 'rating' : 's.' + col} ${order}`;

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;