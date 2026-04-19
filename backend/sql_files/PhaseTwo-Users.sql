-- USERS Tables
CREATE TABLE "states" (
    "state_id" serial PRIMARY KEY,
    "state_abbr" varchar(2)
);

CREATE TABLE "addresses" (
    "address_id" serial PRIMARY KEY,
    "street" varchar(100),
    "address_line_2" varchar(50),
    "city" varchar(50),
    "state_id" int REFERENCES states(state_id),
    "zipcode" varchar(9)
);

CREATE TABLE "users" (
    "user_id" serial PRIMARY KEY,
    "email" varchar(50) UNIQUE NOT NULL,
    "password_hash" varchar(255) NOT NULL,
    "created_at" timestamp DEFAULT (NOW()),
    "updated_at" timestamp DEFAULT (NOW())
);

CREATE TABLE "users_data" (
    "user_id" int PRIMARY KEY REFERENCES users(user_id),
    "first_name" varchar(25),
    "last_name" varchar(25),
    "phone_number" varchar(15),
    "address_id" int REFERENCES addresses(address_id)
);

CREATE TABLE "role_types" (
    "role_id" serial PRIMARY KEY,
    "role_name" varchar(25)
);

CREATE TABLE "user_roles" (
    "user_id" int REFERENCES users(user_id),
    "role_id" int REFERENCES role_types(role_id),
    "created_at" timestamp DEFAULT (NOW()),
    "updated_at" timestamp DEFAULT (NOW()),
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE "approval_types" (
    "approval_type_id" serial PRIMARY KEY,
    "approval_name" varchar(25)
);

CREATE TABLE "user_approvals" (
    "user_id" int REFERENCES users(user_id),
    "approval_type_id" int REFERENCES approval_types(approval_type_id),
    "approved_at" timestamp DEFAULT (NOW()),
    "approved_by" int REFERENCES users(user_id)
);

-- States table seed
INSERT INTO
    states (state_abbr)
VALUES
    ('AL'),
    ('AK'),
    ('AZ'),
    ('AR'),
    ('CA'),
    ('CO'),
    ('CT'),
    ('DE'),
    ('FL'),
    ('GA'),
    ('HI'),
    ('ID'),
    ('IL'),
    ('IN'),
    ('IA'),
    ('KS'),
    ('KY'),
    ('LA'),
    ('ME'),
    ('MD'),
    ('MA'),
    ('MI'),
    ('MN'),
    ('MS'),
    ('MO'),
    ('MT'),
    ('NE'),
    ('NV'),
    ('NH'),
    ('NJ'),
    ('NM'),
    ('NY'),
    ('NC'),
    ('ND'),
    ('OH'),
    ('OK'),
    ('OR'),
    ('PA'),
    ('RI'),
    ('SC'),
    ('SD'),
    ('TN'),
    ('TX'),
    ('UT'),
    ('VT'),
    ('VA'),
    ('WA'),
    ('WV'),
    ('WI'),
    ('WY');

-- Seed Role_Types Table
INSERT INTO
    role_types(role_name)
VALUES
    ('Super Admin'),
    ('Admin'),
    ('User'),
    ('Volunteer'),
    ('Employee'),
    ('Vet'),
    ('Intake Coordinator'),
    ('Foster Coordinator'),
    ('Adoption Coordinator'),
    ('Transport Coordinator'),
    ('Event Coordinator'),
    ('Behavior Specialist'),
    ('Medical Staff'),
    ('Photographer/Media');

-- Seed Approval_Types Table
INSERT INTO
    approval_types(approval_name)
VALUES
    ('Approved Foster'),
    ('Approved Adopter'),
    ('Approved Volunteer'),
    ('Approved Transporter'),
    ('Approved Behavior Evaluator'),
    ('Approved Medical Handler'),
    ('Approved Intake Specialist'),
    ('Approved Event Volunteer'),
    ('Approved Photographer'),
    ('Approved Shelter Access'),
    ('Approved Key Holder'),
    ('Approved Vet');