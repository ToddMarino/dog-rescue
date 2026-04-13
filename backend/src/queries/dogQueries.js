// GET Dogs
// public
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
  COALESCE(
  (
    SELECT
      json_agg(
      json_build_object(
        'breed_id', db.breed_id,
        'breed_name', b.breed_name,
        'primary_breed', db.primary_breed
      )
      )
    FROM
      dog_breeds db
    JOIN
      breeds b ON b.breed_id = db.breed_id
    WHERE
      db.dog_id = d.dog_id
    ),
    '[]' :: json
  ) AS breeds,
  COALESCE(
  (
  SELECT
  json_agg(
  json_build_object(
    'tag_id', bt.tag_id,
    'tag_name', bt.tag_name
  )
  )
  FROM
  behavior beh
  JOIN behavior_tags bt ON bt.tag_id = beh.tag_id
  WHERE
  beh.dog_id = d.dog_id
  ),
  '[]' :: json
  ) AS behaviors_tags

FROM
dogs d
LEFT JOIN genders g ON g.gender_id = d.gender_id
LEFT JOIN intake_types it ON it.intake_type_id = d.intake_type_id
LEFT JOIN locations l ON l.location_id = d.current_location_id
LEFT JOIN location_types lt ON lt.location_type_id = l.location_type_id
LEFT JOIN sizes s ON s.size_id = d.size_id
LEFT JOIN statuses st ON st.status_id = d.status_id

${filter}


ORDER BY
d.dog_id;
  `;

export const sql = buildDogSelect();
export const sqlById = buildDogSelect('WHERE d.dog_id = $1');

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
    estimated_age_years,
    estimated_age_months
  )
    VALUES (
    $1, $2, $3, $4, $5, $6,
    $7, $8, $9, $10, $11, $12
    )

    RETURNING dog_id;
`;