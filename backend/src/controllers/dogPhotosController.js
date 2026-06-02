import { pool } from '../db/pool.js';

// POST Dog Photo
export const addDogPhoto = async (req, res) => {
  try {
    const { dog_id, photo_url, is_primary = false, sort_order = 1 } = req.body;

    if (!dog_id || !photo_url) {
      return res
        .status(400)
        .json({ error: 'dog_id and photo_url are required' });
    }

    const existingPhotos = await pool.query(`
      SELECT photo_id FROM dog_photos WHERE dog_id = $1
      `, [dog_id]);
    
    if (existingPhotos.rowCount === 0) {
      is_primary = true;
    }

    if (is_primary) {
      await pool.query(
        `UPDATE dog_photos SET is_primary = false WHERE dog_id = $1`,
        [dog_id],
      );
    }

    const result = await pool.query(
      `
          INSERT INTO dog_photos (dog_id, photo_url, is_primary, sort_order)
          VALUES ($1, $2, $3, $4)
          RETURNING photo_id, dog_id, photo_url, is_primary, sort_order, uploaded_at
          `,
      [dog_id, photo_url, is_primary, sort_order],
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting dog photo:', err);
    res.status(500).json({ error: 'Failed to insert dog photo' });
  }
};

// GET dog photo
export const getDogPhotos = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
      SELECT photo_id, dog_id, photo_url, is_primary, sort_order, uploaded_at
      FROM dog_photos
      WHERE dog_id = $1
      ORDER BY is_primary DESC, sort_order ASC, uploaded_at ASC
      `,
      [id],
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching dog photos: ', err);
    res.status(500).json({ error: 'Failed to fetch dog photos' });
  }
};

// SET Primary Photo
export const setPrimaryPhoto = async (req, res) => {
  try {
    const { photo_id } = req.params;

    // Get dog_id for the photo
    const { rows } = await pool.query(
      `
      SELECT dog_id FROM dog_photos WHERE photo_id = $1
      `,
      [photo_id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    const dog_id = rows[0].dog_id;

    // Unset all other primary photos
    await pool.query(
      `
      UPDATE dog_photos SET is_primary = false WHERE dog_id = $1
      `,
      [dog_id],
    );

    // Set this photo as primary
    await pool.query(
      `
      UPDATE dog_photos SET is_primary = true WHERE photo_id = $1
      `,
      [photo_id],
    );

    res.json({ message: 'Primary photo updated' });
  } catch (err) {
    console.error('Error setting primary photo: ', err);
    res.status(500).json({ error: 'Failed to set primary photo' });
  }
};

// Delete a photo
export const deleteDogPhoto = async (req, res) => {
  try {
    const { photo_id } = req.params;

    await pool.query(`DELETE FROM dog_photos WHERE photo_id = $1`, [photo_id]);

    res.json({ message: 'Photo deleted' });
  } catch (err) {
    console.error('Error deleting dog photo:', err);
    res.status(500).json({ error: 'Failed to delete dog photo' });
  }
};
