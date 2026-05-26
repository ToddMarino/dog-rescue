import { pool } from "../db/pool.js";

export const getBehaviorTags = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT tag_id, tag_name FROM behavior_tags ORDER BY tag_name`
        )
        res.json(result.rows)
    } catch (err) {
        console.error('Error fetching behavior tags', err)
        res.status(500).json({error: 'Failed to fetch behavior tags'})
    }
}