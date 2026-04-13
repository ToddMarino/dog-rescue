-- GENDERS
INSERT INTO
    genders(gender)
VALUES
    ('Male'),
    ('Female'),
    ('Unknown');

-- DOG SIZES
INSERT INTO
    sizes(sort_order, size)
VALUES
    (1, 'Extra-Small'),
    (2, 'Small'),
    (3, 'Medium'),
    (4, 'Large'),
    (5, 'Extra-Large');

-- STATUSES
INSERT INTO
    statuses(STATUS)
VALUES
    ('Available'),
    ('Fostered'),
    ('Adoption-Pending'),
    ('Adopted'),
    ('Returned'),
    ('Hold'),
    ('Medical Hold');

-- INTAKE TYPES
INSERT INTO
    intake_types(intake_type)
VALUES
    ('Stray'),
    ('Surrender'),
    ('Adoption Return'),
    ('Agency Transfer'),
    ('Other');

-- LOCATION TYPES
INSERT INTO
    location_types(location_name)
VALUES
    ('Animal Control'),
    ('Shelter'),
    ('Foster'),
    ('Boarding Partner'),
    ('Vet Clinic');

-- BEHAVIOR TAGS
INSERT INTO
    behavior_tags(tag_name)
VALUES
    ('Good with female dogs'),
    ('Good with male dogs'),
    ('Good with children'),
    ('Housebroken'),
    ('High Energy'),
    ('Crate-trained'),
    ('Needs Fenced Yard');