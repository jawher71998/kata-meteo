-- Données initiales : 20 pays et leurs villes (source : liste_pays_villes.xlsx, corrigée)
-- Fichier rejouable : relancé, il met à jour les coordonnées au lieu de créer des doublons.
-- Encodage : UTF-8 (noms accentués). Avant exécution sous Windows :
--   $env:PGCLIENTENCODING = "UTF8"

-- Pays
INSERT INTO countries (name, code) VALUES
    ('France', 'FR'),
    ('États-Unis', 'US'),
    ('Tunisie', 'TN'),
    ('Canada', 'CA'),
    ('Allemagne', 'DE'),
    ('Italie', 'IT'),
    ('Espagne', 'ES'),
    ('Royaume-Uni', 'GB'),
    ('Algérie', 'DZ'),
    ('Maroc', 'MA'),
    ('Turquie', 'TR'),
    ('Japon', 'JP'),
    ('Chine', 'CN'),
    ('Inde', 'IN'),
    ('Australie', 'AU'),
    ('Brésil', 'BR'),
    ('Argentine', 'AR'),
    ('Sénégal', 'SN'),
    ('Arabie saoudite', 'SA'),
    ('Égypte', 'EG')
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name;

-- Villes
INSERT INTO cities (name, latitude, longitude, country_id)
SELECT v.name, v.latitude, v.longitude, c.id
FROM (VALUES
    -- France
    ('Paris', 48.862725, 2.287592, 'FR'),
    ('Lille', 50.636565, 3.063528, 'FR'),
    ('Lyon', 45.757814, 4.832011, 'FR'),
    ('Marseille', 43.296399, 5.377789, 'FR'),
    -- États-Unis
    ('New York', 40.712728, -74.006015, 'US'),
    ('Miami', 25.774157, -80.193597, 'US'),
    ('Los Angeles', 34.053692, -118.242768, 'US'),
    ('Houston', 29.760400, -95.369800, 'US'),
    -- Tunisie
    ('Tunis', 36.800207, 10.185776, 'TN'),
    ('Sousse', 35.828828, 10.640525, 'TN'),
    ('Monastir', 35.770758, 10.828051, 'TN'),
    ('Sfax', 34.739436, 10.760402, 'TN'),
    -- Canada
    ('Montréal', 45.503182, -73.569806, 'CA'),
    ('Toronto', 43.653482, -79.383935, 'CA'),
    ('Vancouver', 49.260872, -123.113952, 'CA'),
    ('Ottawa', 45.420878, -75.690111, 'CA'),
    -- Allemagne
    ('Berlin', 52.517389, 13.395131, 'DE'),
    ('Munich', 48.137108, 11.575382, 'DE'),
    ('Hambourg', 53.550172, 10.001316, 'DE'),
    ('Francfort', 50.110644, 8.682092, 'DE'),
    -- Italie
    ('Rome', 41.893320, 12.482932, 'IT'),
    ('Milan', 45.464194, 9.189635, 'IT'),
    ('Naples', 40.835885, 14.248768, 'IT'),
    ('Florence', 43.769796, 11.255640, 'IT'),
    -- Espagne
    ('Madrid', 40.416782, -3.703507, 'ES'),
    ('Barcelone', 41.382580, 2.177073, 'ES'),
    ('Valence', 39.469707, -0.376335, 'ES'),
    ('Séville', 37.388630, -5.995340, 'ES'),
    -- Royaume-Uni
    ('Londres', 51.507446, -0.127765, 'GB'),
    ('Manchester', 53.442462, -2.232455, 'GB'),
    ('Birmingham', 52.494899, -1.851844, 'GB'),
    ('Liverpool', 53.393341, -2.916639, 'GB'),
    -- Algérie
    ('Alger', 36.772933, 3.058845, 'DZ'),
    ('Oran', 35.704442, -0.650298, 'DZ'),
    ('Constantine', 36.364164, 6.608428, 'DZ'),
    ('Annaba', 36.898216, 7.754927, 'DZ'),
    -- Maroc
    ('Casablanca', 33.594514, -7.620028, 'MA'),
    ('Rabat', 34.021845, -6.840893, 'MA'),
    ('Marrakech', 31.625826, -7.989161, 'MA'),
    ('Tanger', 35.769491, -5.804468, 'MA'),
    -- Turquie
    ('Istanbul', 41.006381, 28.975872, 'TR'),
    ('Ankara', 39.920776, 32.854050, 'TR'),
    ('Izmir', 38.419254, 27.128469, 'TR'),
    ('Antalya', 36.886573, 30.703024, 'TR'),
    -- Japon
    ('Tokyo', 35.676860, 139.763895, 'JP'),
    ('Osaka', 34.693757, 135.501454, 'JP'),
    ('Kyoto', 35.011575, 135.768144, 'JP'),
    ('Yokohama', 35.450338, 139.634380, 'JP'),
    -- Chine
    ('Pékin', 39.905714, 116.391297, 'CN'),
    ('Shanghai', 31.231271, 121.470015, 'CN'),
    ('Canton', 23.128843, 113.258958, 'CN'),
    ('Shenzhen', 22.544574, 114.054543, 'CN'),
    -- Inde
    ('New Delhi', 28.613895, 77.209006, 'IN'),
    ('Mumbai', 19.054999, 72.869203, 'IN'),
    ('Bangalore', 12.976794, 77.590082, 'IN'),
    ('Chennai', 13.080091, 80.280798, 'IN'),
    -- Australie
    ('Sydney', -33.869844, 151.208285, 'AU'),
    ('Melbourne', -37.814245, 144.963173, 'AU'),
    ('Brisbane', -27.468962, 153.023501, 'AU'),
    ('Perth', -31.955897, 115.860578, 'AU'),
    -- Brésil
    ('São Paulo', -23.550651, -46.633382, 'BR'),
    ('Rio de Janeiro', -22.911014, -43.209373, 'BR'),
    ('Brasília', -15.793987, -47.882800, 'BR'),
    ('Salvador', -12.974722, -38.476665, 'BR'),
    -- Argentine
    ('Buenos Aires', -34.609558, -58.388790, 'AR'),
    ('Córdoba', -31.416687, -64.183419, 'AR'),
    ('Rosario', -32.959361, -60.661702, 'AR'),
    ('Mendoza', -32.889460, -68.845820, 'AR'),
    -- Sénégal
    ('Dakar', 14.693425, -17.447938, 'SN'),
    ('Thiès', 14.791461, -16.925605, 'SN'),
    ('Saint-Louis', 16.028045, -16.504869, 'SN'),
    ('Ziguinchor', 12.563493, -16.272461, 'SN'),
    -- Arabie saoudite
    ('Riyad', 24.638916, 46.716010, 'SA'),
    ('Djeddah', 21.550443, 39.174236, 'SA'),
    ('La Mecque', 21.420847, 39.826869, 'SA'),
    ('Médine', 24.471153, 39.611122, 'SA'),
    -- Égypte
    ('Le Caire', 30.062630, 31.249670, 'EG'),
    ('Alexandrie', 31.201760, 29.915820, 'EG'),
    ('Gizeh', 30.009440, 31.208610, 'EG'),
    ('Louxor', 25.698930, 32.642100, 'EG')
) AS v(name, latitude, longitude, country_code)
JOIN countries c ON c.code = v.country_code
ON CONFLICT (name, country_id) DO UPDATE
    SET latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude;
