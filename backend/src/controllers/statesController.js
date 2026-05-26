import { pool } from "../db/pool.js";

export const getStates = async (req, res) => {
    try {
        const result = await pool.query(`SELECT state_id, state_abbr FROM states ORDER BY state_abbr`);
            res.json(result.rows);
    } catch (err) {
        console.error('Error fetching approval states', err);
        res.status(500).json({error: 'Failed to fetch approval states'})
    }
}