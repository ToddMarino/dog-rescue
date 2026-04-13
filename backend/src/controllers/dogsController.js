import { pool } from '../db/pool.js';
import { sql, sqlById, buildDogCreate } from '../queries/dogQueries.js';

// GET - Get All Dogs
// Public Access - /Dogs
export const getDogs = async (req, res) => {
  try {
    const result = await pool.query(sql);

    res.json(result.rows);
  } catch (err) {
    console.error('DOGS_GET_ERROR', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get all dogs',
      code: 'DOGS_GET_ERROR',
    });
  }
};

// GET - Get Dog By ID
// Public Access - /Dogs/:id
export const getDogById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid dog ID' });
    }

    const result = await pool.query(sqlById, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Dog not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('DOG_GET_ERROR', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to single dog',
      code: 'DOG_GET_ERROR',
    });
  }
};

// POST - Create New Dog
// Admin Access - /dogs
export const createDog = async (req, res) => {
  const client = await pool.connect();

  try {
    // ------------------------------------------------------------
    // 1) Start a database transaction.
    //    Everything below MUST succeed together.
    //    If any insert fails (dog, breeds, behavior), we ROLLBACK.
    // ------------------------------------------------------------
    await client.query('BEGIN');

    // ------------------------------------------------------------
    // 2) Extract all fields from the request body.
    //    These come directly from the frontend form.
    //    "breeds" and "behavior_tags" are arrays.
    // ------------------------------------------------------------
    const {
      name,
      gender_id,
      size_id,
      status_id,
      intake_type_id,
      current_location_id,
      date_of_birth,
      weight,
      microchip_number,
      intake_date,
      estimated_age_years,
      estimated_age_months,
      breeds,
      behavior_tags,
    } = req.body;

    // ------------------------------------------------------------
    // 3) Insert the main dog record.
    //    buildDogCreate returns the SQL for inserting a dog.
    //    Postgres returns the new dog_id, which we MUST use
    //    for inserting breeds and behavior tags.
    // ------------------------------------------------------------
    const dogResult = await client.query(buildDogCreate, [
      name,
      gender_id,
      size_id,
      status_id,
      intake_type_id,
      current_location_id,
      date_of_birth,
      weight,
      microchip_number,
      intake_date,
      estimated_age_years,
      estimated_age_months,
    ]);

    // The newly created dog's primary key.
    const dogId = dogResult.rows[0].dog_id;

    // ------------------------------------------------------------
    // 4) Insert breeds for this dog.
    //    Each breed entry contains:
    //      - breed_id
    //      - primary_breed (boolean)
    //
    //    We loop through the array and insert each one.
    //    If breeds is empty or missing, nothing happens.
    // ------------------------------------------------------------
    if (Array.isArray(breeds)) {
      for (const breed of breeds) {
        await client.query(
          `INSERT INTO dog_breeds (dog_id, breed_id, primary_breed)
           VALUES ($1, $2, $3)`,
          [dogId, breed.breed_id, breed.primary_breed]
        );
      }
    }

    // ------------------------------------------------------------
    // 5) Insert behavior tags for this dog.
    //    Each tag entry contains:
    //      - tag_id
    //
    //    Same pattern as breeds: loop and insert.
    // ------------------------------------------------------------
    if (Array.isArray(behavior_tags)) {
      for (const tag of behavior_tags) {
        await client.query(
          `INSERT INTO behavior (dog_id, tag_id)
           VALUES ($1, $2)`,
          [dogId, tag.tag_id]
        );
      }
    }

    // ------------------------------------------------------------
    // 6) If we reach this point:
    //      - dog insert succeeded
    //      - all breed inserts succeeded
    //      - all behavior inserts succeeded
    //
    //    So we COMMIT the transaction.
    // ------------------------------------------------------------
    await client.query('COMMIT');

    // ------------------------------------------------------------
    // 7) Respond to the client.
    //    Only now do we send a success response.
    //    The dogId is returned so the frontend can redirect
    //    or fetch the new dog immediately.
    // ------------------------------------------------------------
    res.status(201).json({ dog_id: dogId });

  } catch (err) {
    // ------------------------------------------------------------
    // 8) If ANYTHING above fails:
    //      - SQL error
    //      - missing field
    //      - invalid breed/tag data
    //
    //    We ROLLBACK the entire transaction so the database
    //    is not left in a half‑completed state.
    // ------------------------------------------------------------
    await client.query('ROLLBACK');

    console.error('DOG_POST_ERROR', err);

    res.status(500).json({
      status: 'error',
      message: 'Failed to create new dog',
      code: 'DOG_POST_ERROR',
    });

  } finally {
    // ------------------------------------------------------------
    // 9) Release the database connection back to the pool.
    //    This ALWAYS runs, success or failure.
    // ------------------------------------------------------------
    client.release();
  }
};

