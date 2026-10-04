const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Get all stores with overall rating and current user's submitted rating
router.get('/', authenticateToken, async (req, res) => {
  const { search, sortBy = 'name', sortOrder = 'ASC' } = req.query;
  const validSortCols = ['name', 'address', 'overall_rating'];
  const col = validSortCols.includes(sortBy) ? sortBy : 'name';
  const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  let query = `
    SELECT s.id, s.name, s.address,
           COALESCE(ROUND(AVG(r.rating)::numeric, 2), 0) as overall_rating,
           (SELECT rating FROM ratings WHERE store_id = s.id AND user_id = $1) as user_rating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    WHERE 1=1
  `;
  const params = [req.user.id];

  if (search) {
    params.push(`%${search}%`);
    query += ` AND (s.name ILIKE $${params.length} OR s.address ILIKE $${params.length})`;
  }

  query += ` GROUP BY s.id ORDER BY ${col === 'overall_rating' ? 'overall_rating' : 's.' + col} ${order}`;

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit or Modify Rating (1-5)
router.post('/:storeId/rate', authenticateToken, async (req, res) => {
  const { storeId } = req.params;
  const { rating } = req.body;

  const numRating = parseInt(rating, 10);
  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    return res.status(400).json({ error: 'Rating must be an integer between 1 and 5.' });
  }

  try {
    const query = `
      INSERT INTO ratings (user_id, store_id, rating, updated_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (user_id, store_id)
      DO UPDATE SET rating = EXCLUDED.rating, updated_at = NOW()
      RETURNING *;
    `;
    const result = await pool.query(query, [req.user.id, storeId, numRating]);
    res.json({ message: 'Rating saved successfully.', rating: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;