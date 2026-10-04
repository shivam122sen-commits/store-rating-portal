const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.use(authenticateToken, authorizeRoles('Store Owner'));

// Fetch Store Owner's dashboard: Average rating & users who reviewed
router.get('/dashboard', async (req, res) => {
  try {
    const storeRes = await pool.query('SELECT * FROM stores WHERE owner_id = $1', [req.user.id]);
    if (storeRes.rows.length === 0) {
      return res.status(404).json({ error: 'No store linked to this owner account.' });
    }

    const store = storeRes.rows[0];

    // Ratings list with user details
    const ratingsQuery = `
      SELECT u.id as user_id, u.name as user_name, u.email as user_email, r.rating, r.updated_at
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = $1
      ORDER BY r.updated_at DESC
    `;
    const ratingsRes = await pool.query(ratingsQuery, [store.id]);

    // Average rating
    const avgQuery = `SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 0) as average_rating FROM ratings WHERE store_id = $1`;
    const avgRes = await pool.query(avgQuery, [store.id]);

    res.json({
      store,
      averageRating: avgRes.rows[0].average_rating,
      ratedUsers: ratingsRes.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;