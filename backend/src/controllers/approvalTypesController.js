import { pool } from "../db/pool.js";

export const getApprovalTypes = async (req, res) => {
    try {
        const result = await pool.query(`SELECT approval_type_id, approval_name FROM approval_types ORDER BY approval_name`);
            res.json(result.rows);
    } catch (err) {
        console.error('Error fetching approval types', err);
        res.status(500).json({error: 'Failed to fetch approval types'})
    }
}