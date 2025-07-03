/* -------------------------
        mooc CONTEXT
---------------------------- */

CREATE TABLE IF NOT EXISTS mooc__users (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  profile_picture VARCHAR(255),
  status VARCHAR(255),
  completed_courses TEXT
);

INSERT INTO mooc__users (
  id,
  name,
  email,
  profile_picture,
  status,
  completed_courses
) VALUES (
  'b1a2c3d4-e5f6-7890-abcd-1234567890ef',
  'Sofía Martínez',
  'sofia.martinez@example.com',
  'https://randomuser.me/api/portraits/women/32.jpg',
  'active',
  '["Machine Learning", "JavaScript Algorithms and Data Structures", "The Complete React Developer Course"]'
);
