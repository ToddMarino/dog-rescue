import { pool } from "../db/pool.js";

export const getStatuses = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT status_id, status FROM statuses ORDER BY status`
        );
            res.json(result.rows);
    } catch (err) {
        console.error('Error fetching statuses', err);
        res.status(500).json({error: 'Failed to fetch statuses'})
    }
}