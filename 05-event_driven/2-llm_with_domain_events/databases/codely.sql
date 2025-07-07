/* -------------------------
        mooc CONTEXT
---------------------------- */

CREATE TABLE mooc__users (
	id UUID PRIMARY KEY,
	name VARCHAR(255),
	email VARCHAR(255),
	profile_picture VARCHAR(255),
	status VARCHAR(255),
	suggested_courses TEXT
);

CREATE TABLE mooc__user_course_suggestions (
	user_id UUID PRIMARY KEY,
	completed_courses TEXT,
	suggested_courses TEXT
);

INSERT INTO mooc__users (id, name, email, profile_picture, status, suggested_courses)
VALUES (
    '3f9e1d42-7d28-4b62-9d3a-2c6f1e4a0bde',
    'Ana Pérez',
    'ana.perez@example.com',
    'https://example.com/profiles/ana.jpg',
    'active',
    NULL
);

INSERT INTO mooc__user_course_suggestions (user_id, completed_courses, suggested_courses)
VALUES (
    -- Aquí debes poner el mismo UUID que el insert anterior
    (SELECT id FROM mooc__users WHERE email = 'ana.perez@example.com'),
    '["Diseño de infraestructura: AWS SQS como cola de mensajería", "TypeScript Avanzado: Mejora tu Developer eXperience", "Grafana"]',
    '[]'
);
