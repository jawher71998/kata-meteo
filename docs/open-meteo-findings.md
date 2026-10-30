# Open-Meteo : résultats de l'exploration

Tests réalisés le 30/10/2026 avec Postman, sur Tunis (latitude 36.8065, longitude 10.1815).

## Endpoints

| Mode | URL de base |
|---|---|
| Actuel et prévisions | https://api.open-meteo.com/v1/forecast |
| Historique | https://archive-api.open-meteo.com/v1/archive |

## Variables validées

- `current` : temperature_2m, precipitation, cloud_cover, wind_speed_10m, weather_code
- `daily` (prévisions) : temperature_2m_max, temperature_2m_min, precipitation_sum, precipitation_probability_max, wind_speed_10m_max, sunrise, sunset, weather_code, cloud_cover_mean
- `daily` (historique) : mêmes variables, sauf precipitation_probability_max (non testée)

## Règles de fonctionnement observées

- Utiliser `timezone=auto` : les heures sont renvoyées en heure locale de la ville.
- Les heures sont au format ISO sans décalage (`2026-10-30T06:41`) : extraire `HH:mm`.
- Les variables `daily` sont des tableaux alignés sur le tableau `time` : le backend doit les transformer en liste d'objets (un objet par jour).
- Mode actuel : un seul appel avec `forecast_days=1`, `current=...` et `daily=sunrise,sunset`.
- Les coordonnées renvoyées sont ajustées au point de grille le plus proche : ne pas les afficher, utiliser celles de la base.
- Format d'erreur : HTTP 400 avec `{"error": true, "reason": "..."}`.

## Limites de l'API et règles du projet

| Sujet | Limite de l'API | Règle du projet |
|---|---|---|
| Prévisions en nombre de jours | 0 à 16 | 1 à 15 |
| Historique | du 1940-01-01 à la date du jour | du 2000-01-01 à aujourd'hui |
| Prévisions par dates | une plage début-fin uniquement | 1 à 3 dates, dans les 15 jours |

Le backend valide lui-même ces règles et renvoie ses propres messages d'erreur.

Pour 2 ou 3 dates non consécutives : demander la plage allant de la première à la dernière date, puis ne garder que les dates choisies.

## Points d'attention

- Une prévision et l'archive d'un même jour peuvent différer (ex. 30/10 : prévision faite le 28/10 avec weather_code 95 et 4,6 mm, archive avec weather_code 55 et 1,9 mm).
- Aucune valeur `null` observée pendant les tests : le backend doit quand même les gérer et afficher « données non disponibles », jamais 0.
- Une requête à 15 jours a renvoyé des valeurs légèrement différentes de celles d'une requête à 7 ou 16 jours (altitude 80 au lieu de 11). Cause inconnue, à investiguer.