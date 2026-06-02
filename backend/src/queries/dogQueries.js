// GET Dogs
// Public
export const buildDogSelect = (filter = '') => `
SELECT
  d.dog_id,
  st.status,
  d.name,
  g.gender,
  d.date_of_birth,
  d.weight,
  s.size,
  it.intake_type,
  l.location_id,
  lt.location_name AS location_type,
  d.intake_notes,
  d.medical_notes,
  d.foster_notes,
  d.microchip_number,
  d.utd_shots,
  d.fixed,

  -- Breeds
  COALESCE(
    (
      SELECT json_agg(
        json_build_object(
          'breed_id', db.breed_id,
          'breed_name', b.breed_name
        )
      )
      FROM dog_breeds db
      JOIN breeds b ON b.breed_id = db.breed_id
      WHERE db.dog_id = d.dog_id
    ),
    '[]'::json
  ) AS breeds,

  -- Behavior Tags
  COALESCE(
    (
      SELECT json_agg(
        json_build_object(
          'tag_id', bt.tag_id,
          'tag_name', bt.tag_name
        )
      )
      FROM behavior beh
      JOIN behavior_tags bt ON bt.tag_id = beh.tag_id
      WHERE beh.dog_id = d.dog_id
    ),
    '[]'::json
  ) AS behavior_tags,

  -- Photos
  COALESCE(
    (
      SELECT json_agg(photo_obj ORDER BY is_primary DESC, sort_order ASC, uploaded_at ASC)
      FROM (
        SELECT
          json_build_object(
            'photo_id', dp.photo_id,
            'photo_url', dp.photo_url,
            'is_primary', dp.is_primary,
            'sort_order', dp.sort_order,
            'uploaded_at', dp.uploaded_at
          ) AS photo_obj,
          dp.is_primary,
          dp.sort_order,
          dp.uploaded_at
        FROM dog_photos dp
        WHERE dp.dog_id = d.dog_id
        ORDER BY dp.is_primary DESC, dp.sort_order ASC, dp.uploaded_at ASC
      ) AS ordered_photos
    ),
    '[]'::json
  ) AS photos

FROM dogs d
LEFT JOIN genders g ON g.gender_id = d.gender_id
LEFT JOIN intake_types it ON it.intake_type_id = d.intake_type_id
LEFT JOIN locations l ON l.location_id = d.current_location_id
LEFT JOIN location_types lt ON lt.location_type_id = l.location_type_id
LEFT JOIN sizes s ON s.size_id = d.size_id
LEFT JOIN statuses st ON st.status_id = d.status_id

${filter}

ORDER BY d.dog_id;
`;


// POST Dogs
// Admin
export const buildDogCreate = `
  INSERT INTO dogs (
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
    intake_notes,
    medical_notes,
    foster_notes,
    utd_shots,
    fixed
  )
    VALUES (
    $1, $2, $3, $4, $5, $6,
    $7, $8, $9, $10, $11, $12, $13, $14, $15
    )

    RETURNING dog_id;
`;

// DELETE Dog
// Admin
export const sqlDeleteDog = `
  DELETE
  FROM dogs d
  WHERE dog_id = $1
  RETURNING dog_id
  `;

export const sql = buildDogSelect();
export const sqlById = buildDogSelect('WHERE d.dog_id = $1');
