/* -------------------------
        mooc CONTEXT
---------------------------- */

CREATE TABLE mooc__users (
	id UUID PRIMARY KEY,
	name VARCHAR(255),
	email VARCHAR(255),
	profile_picture VARCHAR(255),
	status VARCHAR(255),
	finished_courses TEXT
);

INSERT INTO mooc__users (id, name, email, profile_picture, status, finished_courses)
VALUES (
    'a3f1c2d4-5b67-4e89-90ab-1c2d3e4f5a6b',
    'Jane Doe',
    'jane.doe@example.com',
    'https://example.com/images/jane.jpg',
    'active',
    '["machine-learning", "python-for-data-science", "deep-learning-specialization"]'
);
