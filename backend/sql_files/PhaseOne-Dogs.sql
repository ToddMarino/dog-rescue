-- ============================
-- Lookup Tables
-- ============================
CREATE TABLE "breeds" (
  "breed_id" serial PRIMARY KEY,
  "breed_name" varchar(50) UNIQUE NOT NULL
);

CREATE TABLE "sizes" (
  "size_id" serial PRIMARY KEY,
  "sort_order" int,
  "size" varchar(25)
);

CREATE TABLE "behavior_tags" (
  "tag_id" serial PRIMARY KEY,
  "tag_name" varchar(50)
);

CREATE TABLE "location_types" (
  "location_type_id" serial PRIMARY KEY,
  "location_name" varchar(100)
);

CREATE TABLE "intake_types" (
  "intake_type_id" serial PRIMARY KEY,
  "intake_type" varchar(25)
);

CREATE TABLE "genders" (
  "gender_id" serial PRIMARY KEY,
  "gender" varchar(7)
);

CREATE TABLE "statuses" (
  "status_id" serial PRIMARY KEY,
  "status" varchar(25)
);

-- ============================
-- Core Tables
-- ============================
CREATE TABLE "locations" (
  "location_id" serial PRIMARY KEY,
  "location_type_id" int REFERENCES "location_types" ("location_type_id") DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE "dogs" (
  "dog_id" serial PRIMARY KEY,
  "intake_date" timestamp,
  "intake_type_id" int REFERENCES "intake_types" ("intake_type_id") DEFERRABLE INITIALLY DEFERRED,
  "microchip_number" varchar(30) UNIQUE,
  "name" varchar(50),
  "sex_id" int REFERENCES "sexes" ("sex_id") DEFERRABLE INITIALLY DEFERRED,
  "date_of_birth" date,
  "estimated_age_years" int,
  "estimated_age_months" int,
  "weight" int,
  "size_id" int REFERENCES "sizes" ("size_id") DEFERRABLE INITIALLY DEFERRED,
  "utd_shots" boolean,
  "fixed" boolean,
  "current_location_id" int REFERENCES "locations" ("location_id") DEFERRABLE INITIALLY DEFERRED,
  "status_id" int REFERENCES "statuses" ("status_id") DEFERRABLE INITIALLY DEFERRED,
  "created_at" timestamp DEFAULT NOW(),
  "updated_at" timestamp
);

-- ============================
-- Junction Tables
-- ============================
CREATE TABLE "dog_breeds" (
  "dog_breed_id" serial PRIMARY KEY,
  "dog_id" int REFERENCES "dogs" ("dog_id") DEFERRABLE INITIALLY DEFERRED,
  "breed_id" int REFERENCES "breeds" ("breed_id") DEFERRABLE INITIALLY DEFERRED,
  "primary_breed" boolean DEFAULT false
);

CREATE TABLE "behavior" (
  "dog_id" int REFERENCES "dogs" ("dog_id") DEFERRABLE INITIALLY DEFERRED,
  "tag_id" int REFERENCES "behavior_tags" ("tag_id") DEFERRABLE INITIALLY DEFERRED
);

-- ============================
-- Photos
-- ============================
CREATE TABLE "dog_photos" (
  "photo_id" serial PRIMARY KEY,
  "photo_sizes" jsonb,
  "photo_url" varchar(500) NOT NULL,
  "is_primary" boolean DEFAULT false,
  "sort_order" int,
  "uploaded_at" timestamp DEFAULT NOW(),
  "dog_id" int REFERENCES "dogs" ("dog_id") DEFERRABLE INITIALLY DEFERRED
);