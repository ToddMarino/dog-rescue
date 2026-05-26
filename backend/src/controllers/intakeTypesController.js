import { pool } from '../db/pool.js';

export const getIntakeTypes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT intake_type_id, intake_type FROM intake_types ORDER BY intake_type`,
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching intake types', err);
    res.status(500).json({ error: 'Failed to fetch intake types' });
  }
};
