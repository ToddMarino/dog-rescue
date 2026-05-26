import {pool} from '../db/pool.js';

export const getBreeds = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT breed_id, breed_name FROM breeds ORDER BY breed_name`,
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching breeds', err);
    res.status(500).json({ error: 'Failed to fetch breeds' });
  }
};
