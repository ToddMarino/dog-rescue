import { pool } from "../db/pool.js";

export const getGenders = async (req, res) => {
    try {
        const result = await pool.query(`SELECT gender_id, gender FROM genders ORDER BY gender`);
        res.json(result.rows)
    } catch (err) {
        console.error('Error fetching genders', err)
        res.status(500).json({error: 'Failed to fetch genders'})
    }
}