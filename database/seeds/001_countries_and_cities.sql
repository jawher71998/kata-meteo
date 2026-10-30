-- Pays
INSERT INTO countries (name, code) VALUES
    ('Tunisie', 'TN'),
    ('France', 'FR')
ON CONFLICT (code) DO NOTHING;

-- Villes de Tunisie (données du document)
INSERT INTO cities (name, latitude, longitude, country_id)
SELECT v.name, v.latitude, v.longitude, c.id
FROM (VALUES
    ('Tunis',    36.8065, 10.1815),
    ('Sousse',   35.8256, 10.6084),
    ('Monastir', 35.7770, 10.8262),
    ('Sfax',     34.7406, 10.7603)
) AS v(name, latitude, longitude)
JOIN countries c ON c.code = 'TN'
ON CONFLICT (name, country_id) DO NOTHING;

-- Villes de France (ajout pour tester le sélecteur de pays)
INSERT INTO cities (name, latitude, longitude, country_id)
SELECT v.name, v.latitude, v.longitude, c.id
FROM (VALUES
    ('Paris',     48.8566, 2.3522),
    ('Marseille', 43.2965, 5.3698)
) AS v(name, latitude, longitude)
JOIN countries c ON c.code = 'FR'
ON CONFLICT (name, country_id) DO NOTHING;