import { pool } from "../db/pool.js";

export const getLocationTypes = async (req, res) => {
    try {
        const result = await pool.query(`SELECT location_type_id, location_name FROM location_types ORDER BY location_types`)
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching location types', err);
        res.status(500).json({error: 'Failed to fetch location types'})
    }
}