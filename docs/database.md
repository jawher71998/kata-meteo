# Base de données

PostgreSQL 18. Base : `kata_meteo`. Utilisateur applicatif : `kata_meteo_user`.

## Modèle

```
countries (1) ────< (N) cities
```

| Table | Colonnes |
|---|---|
| countries | id, name, code (2 lettres, unique) |
| cities | id, name, latitude, longitude, country_id |

Contraintes de `cities` : couple (name, country_id) unique, latitude entre -90 et 90, longitude entre -180 et 180, country_id obligatoire et relié à `countries`.

## Mise en place

1. Créer l'utilisateur et la base, avec le compte administrateur :

```sql
CREATE USER kata_meteo_user WITH PASSWORD 'votre-mot-de-passe';
CREATE DATABASE kata_meteo OWNER kata_meteo_user;
```

2. Copier `.env.example` en `.env` et renseigner `DB_PASSWORD`.

3. Exécuter les migrations, dans l'ordre :

```
psql -U kata_meteo_user -d kata_meteo -h localhost -f database/migrations/001_create_countries.sql
psql -U kata_meteo_user -d kata_meteo -h localhost -f database/migrations/002_create_cities.sql
```

4. Insérer les données initiales (rejouable sans doublon) :

```
psql -U kata_meteo_user -d kata_meteo -h localhost -f database/seeds/001_countries_and_cities.sql
```

## Règles

- Une migration déjà appliquée ne se modifie jamais : on ajoute un nouveau fichier numéroté.
- Les migrations sont appliquées à la main pour l'instant : aucun suivi automatique de celles déjà exécutées.