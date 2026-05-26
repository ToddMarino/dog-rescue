import { pool } from '../db/pool.js';

export const getRoleTypes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT role_id, role_name FROM role_types ORDER BY role_name`,
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching role types');
    res.status(500).json({ error: 'Failed to fetch role types' });
  }
};
