import { pool } from '../db/pool.js';

export const getSizes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT size_id, size, sort_order FROM sizes ORDER BY sort_order`,
    );
    res.json(result.rows);
  } catch (err) {
    console.log('Error fetching sizes', err);
    res.status(500).json({ error: 'Failed to fetch sizes' });
  }
};
