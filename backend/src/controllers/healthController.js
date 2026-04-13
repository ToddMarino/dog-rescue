// src/controllers/healthController.js
import { pool } from '../db/pool.js';

export const getHealth = async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'ok',
      time: result.rows[0].now,
    });
  } catch (err) {
    console.error('Health check failed', err);
    res
      .status(500)
      .json({ status: 'error', message: 'Database conection failed' });
  }
};
