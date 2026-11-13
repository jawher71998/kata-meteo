# API KATA Météo

Référence de l'API REST du backend. Toutes les routes sont en lecture seule (`GET`).

- **URL de base (développement)** : `http://localhost:3000`
- **Format** : JSON, encodage UTF-8
- **Authentification** : aucune
- **Source des données météo** : [Open-Meteo](https://open-meteo.com/) (le backend est le seul à l'appeler)
- **Les valeurs des exemples de ce document sont illustratives.**

## Sommaire

| Route | Rôle |
|---|---|
| `GET /api/health` | Vérifier que l'API répond |
| `GET /api/countries` | Liste des pays |
| `GET /api/countries/:id/cities` | Villes d'un pays |
| `GET /api/cities/:id` | Détail d'une ville |
| `GET /api/weather/current` | Météo actuelle |
| `GET /api/weather/historical` | Météo d'une date passée |
| `GET /api/weather/forecast` | Prévisions |

## Format des erreurs

Toute erreur renvoie un statut HTTP et un corps JSON unique :

```json
{ "error": "Message lisible décrivant le problème." }
```

| Statut | Signification |
|---|---|
| 400 | Paramètre manquant ou invalide |
| 404 | Pays, ville ou route introuvable |
| 500 | Erreur interne imprévue (le détail n'est jamais envoyé au client) |
| 502 | Open-Meteo a répondu avec une erreur ou une réponse inattendue |
| 503 | Open-Meteo est injoignable (délai de 10 secondes dépassé) |

Les entrées sont **toujours validées avant** tout accès à la base ou à Open-Meteo. L'ordre des contrôles est : `cityId`, puis les paramètres propres à la route, puis `fields` / `exclude`, puis l'existence de la ville (404).

---

## Santé

### `GET /api/health`

```json
{ "status": "ok" }
```

---

## Pays et villes

### `GET /api/countries`

Renvoie tous les pays, triés par nom (ordre alphabétique français).

```json
[
  { "id": 14, "name": "Algérie", "code": "DZ" },
  { "id": 10, "name": "Allemagne", "code": "DE" }
]
```

Les `id` ne sont pas contigus : ne jamais les deviner, toujours utiliser ceux renvoyés par l'API.

### `GET /api/countries/:id/cities`

Renvoie les villes d'un pays, triées par nom. Les coordonnées sont des nombres.

```json
[
  { "id": 3, "name": "Monastir", "latitude": 35.770758, "longitude": 10.828051 },
  { "id": 1, "name": "Tunis", "latitude": 36.800207, "longitude": 10.185776 }
]
```

| Statut | Cas | Message |
|---|---|---|
| 400 | `id` qui n'est pas un entier positif | `L'identifiant du pays doit être un entier positif.` |
| 404 | pays inconnu | `Pays introuvable.` |

### `GET /api/cities/:id`

```json
{
  "id": 1,
  "name": "Tunis",
  "latitude": 36.800207,
  "longitude": 10.185776,
  "country": { "id": 1, "name": "Tunisie", "code": "TN" }
}
```

| Statut | Cas | Message |
|---|---|---|
| 400 | `id` invalide | `L'identifiant de la ville doit être un entier positif.` |
| 404 | ville inconnue | `Ville introuvable.` |

---

## Météo

Paramètre commun à toutes les routes météo :

| Paramètre | Obligatoire | Description |
|---|---|---|
| `cityId` | oui | Identifiant d'une ville (entier positif) |
| `fields` ou `exclude` | non | Filtre par catégories (voir « Filtres ») |

Les coordonnées envoyées à Open-Meteo sont celles de la base. Les heures de lever et de coucher du soleil sont en **heure locale de la ville**, au format `HH:mm`. Une donnée absente est renvoyée à `null`, **jamais remplacée par 0**.

### `GET /api/weather/current`

Météo de l'instant (données rafraîchies toutes les 15 minutes par Open-Meteo), avec lever et coucher du soleil du jour, en un seul appel à Open-Meteo.

Exemple : `/api/weather/current?cityId=1`

```json
{
  "city": { "id": 1, "name": "Tunis", "country": "Tunisie" },
  "current": {
    "time": "2026-10-30T17:45",
    "temperature": 18.1,
    "precipitation": 0.1,
    "windSpeed": 4.8,
    "cloudCover": 100,
    "weatherCode": 80,
    "condition": "Averses faibles",
    "sunrise": "06:41",
    "sunset": "17:24"
  },
  "units": {
    "temperature": "°C",
    "precipitation": "mm",
    "windSpeed": "km/h",
    "cloudCover": "%"
  }
}
```

`time` est l'heure locale de la mesure, sans décalage affiché.

### `GET /api/weather/historical`

Données quotidiennes d'une date passée (API Archive d'Open-Meteo).

| Paramètre | Obligatoire | Règle |
|---|---|---|
| `date` | oui | Format `YYYY-MM-DD`, jour existant, entre `2000-01-01` et aujourd'hui (date UTC du serveur) |

Exemple : `/api/weather/historical?cityId=1&date=2025-10-28`

```json
{
  "city": { "id": 1, "name": "Tunis", "country": "Tunisie" },
  "date": "2025-10-28",
  "available": true,
  "message": null,
  "daily": {
    "temperatureMax": 24.2,
    "temperatureMin": 17.1,
    "precipitation": 0,
    "cloudCover": 35,
    "windSpeed": 14.3,
    "weatherCode": 2,
    "condition": "Partiellement nuageux",
    "sunrise": "06:38",
    "sunset": "17:27"
  },
  "units": {
    "temperature": "°C",
    "precipitation": "mm",
    "cloudCover": "%",
    "windSpeed": "km/h"
  }
}
```

Si Open-Meteo n'a aucune donnée pour la date : statut **200**, `available` vaut `false`, `message` contient `Aucune donnée météo disponible pour cette date.` et les valeurs sont à `null`.

### `GET /api/weather/forecast`

Prévisions quotidiennes. **Un seul** des deux paramètres suivants est obligatoire :

| Paramètre | Règle |
|---|---|
| `days` | Entier de **1 à 15** : les N prochains jours, à partir d'aujourd'hui |
| `dates` | **1 à 3 dates** distinctes `YYYY-MM-DD`, séparées par des virgules, comprises entre aujourd'hui et aujourd'hui + 14 jours (15 jours en comptant aujourd'hui) |

Exemples :

- `/api/weather/forecast?cityId=1&days=7`
- `/api/weather/forecast?cityId=1&dates=2026-11-15`
- `/api/weather/forecast?cityId=1&dates=2026-11-14,2026-11-20,2026-11-25`

```json
{
  "city": { "id": 1, "name": "Tunis", "country": "Tunisie" },
  "mode": "dates",
  "days": [
    {
      "date": "2026-11-14",
      "available": true,
      "temperatureMax": 22.8,
      "temperatureMin": 15.2,
      "precipitation": 4.6,
      "precipitationProbability": 62,
      "cloudCover": 80,
      "windSpeed": 6.6,
      "weatherCode": 95,
      "condition": "Orage",
      "sunrise": "06:41",
      "sunset": "17:24"
    }
  ],
  "units": {
    "temperature": "°C",
    "precipitation": "mm",
    "precipitationProbability": "%",
    "cloudCover": "%",
    "windSpeed": "km/h"
  }
}
```

- `mode` vaut `days` ou `dates` selon le paramètre utilisé.
- `precipitation` (quantité, en mm) et `precipitationProbability` (probabilité, en %) sont deux informations distinctes.
- Pour plusieurs dates, une seule requête est faite à Open-Meteo sur la plage du premier au dernier jour, puis seules les dates demandées sont conservées, triées par ordre croissant.
- Un jour absent de la réponse d'Open-Meteo n'est jamais inventé : `available` vaut `false` et ses valeurs sont `null`.

---

## Filtres : `fields` et `exclude`

Disponibles sur les trois routes météo. **Convention unique** :

| Paramètre | Sens | Exemple |
|---|---|---|
| `fields` | Liste blanche : uniquement ces catégories | `fields=sunrise,sunset` |
| `exclude` | Liste noire : toutes les catégories sauf celles-ci | `exclude=clouds` |
| aucun | Toutes les catégories | |
| les deux | **Refusé** (400) | |

Catégories (noms en minuscules, séparés par des virgules) :

| Catégorie | Clés de la réponse |
|---|---|
| `temperature` | `temperature` (actuel) ou `temperatureMax` et `temperatureMin` (jours) |
| `condition` | `weatherCode`, `condition` |
| `rain` | `precipitation`, `precipitationProbability` (prévisions uniquement) |
| `clouds` | `cloudCover` |
| `wind` | `windSpeed` |
| `sunrise` | `sunrise` |
| `sunset` | `sunset` |

Les clés de structure (`city`, `time`, `date`, `available`, `message`, `mode`) sont toujours présentes. Les unités des catégories retirées disparaissent de `units`. Le champ `available` est calculé sur **toutes** les données, avant filtrage.

Exemple : `/api/weather/current?cityId=1&fields=sunrise`

```json
{
  "city": { "id": 1, "name": "Tunis", "country": "Tunisie" },
  "current": { "time": "2026-10-30T17:45", "sunrise": "06:41" },
  "units": {}
}
```

---

## Règles de validation

Ces règles sont celles du **projet**. Certaines sont plus strictes que celles d'Open-Meteo.

| Sujet | Règle du projet | Ce qu'Open-Meteo accepte |
|---|---|---|
| Identifiants | entier positif, au plus 2147483647 | |
| Historique | du 2000-01-01 à aujourd'hui | du 1940-01-01 à aujourd'hui |
| Prévisions en jours | 1 à 15 | 0 à 16 |
| Prévisions par dates | 1 à 3 dates, dans les 15 jours | une plage début-fin uniquement |
| Catégories | 7 valeurs en minuscules, au moins une retenue | |

## Messages d'erreur

| Statut | Message |
|---|---|
| 400 | `Le paramètre cityId est obligatoire.` |
| 400 | `L'identifiant de la ville doit être un entier positif.` |
| 400 | `Le paramètre date est obligatoire.` |
| 400 | `La date doit être au format YYYY-MM-DD et correspondre à un jour existant.` |
| 400 | `La date doit être postérieure ou égale au 2000-01-01.` |
| 400 | `La date ne peut pas être dans le futur.` |
| 400 | `Précisez le paramètre days (1 à 15) ou dates (1 à 3 dates).` |
| 400 | `Utilisez soit le paramètre days, soit le paramètre dates, pas les deux.` |
| 400 | `Le nombre de jours doit être un entier compris entre 1 et 15.` |
| 400 | `Vous pouvez demander entre 1 et 3 dates.` |
| 400 | `Les dates demandées doivent être différentes.` |
| 400 | `Chaque date doit être comprise entre AAAA-MM-JJ et AAAA-MM-JJ (15 jours à partir d'aujourd'hui).` |
| 400 | `Utilisez soit le paramètre fields, soit le paramètre exclude, pas les deux.` |
| 400 | `Catégorie inconnue : ... Catégories autorisées : ...` |
| 400 | `Le paramètre fields doit contenir au moins une catégorie.` (idem pour `exclude`) |
| 400 | `Vous ne pouvez pas exclure toutes les catégories : sélectionnez au moins une donnée.` |
| 404 | `Pays introuvable.` / `Ville introuvable.` / `Route introuvable.` |
| 500 | `Erreur interne du serveur.` |
| 502 | `Le service météo a renvoyé une erreur.` / `Réponse inattendue du service météo.` |
| 503 | `Le service météo est momentanément indisponible.` |

## Codes météo (norme WMO)

| Code | Condition |
|---|---|
| 0 | Ciel dégagé |
| 1 | Plutôt dégagé |
| 2 | Partiellement nuageux |
| 3 | Couvert |
| 45, 48 | Brouillard, brouillard givrant |
| 51, 53, 55 | Bruine légère, modérée, dense |
| 56, 57 | Bruine verglaçante légère, dense |
| 61, 63, 65 | Pluie faible, modérée, forte |
| 66, 67 | Pluie verglaçante légère, forte |
| 71, 73, 75 | Neige faible, modérée, forte |
| 77 | Grains de neige |
| 80, 81, 82 | Averses faibles, modérées, violentes |
| 85, 86 | Averses de neige faibles, fortes |
| 95 | Orage |
| 96, 99 | Orage avec grêle légère, forte grêle |

Un code absent de ce tableau donne la condition `Condition inconnue`. Le code numérique (`weatherCode`) décrit l'état du ciel ; il est distinct des mesures (`cloudCover`, `precipitation`).

## Notes techniques

- Les données sont demandées à Open-Meteo avec `timezone=auto` : jours et heures sont ceux de la ville.
- « Aujourd'hui » est la date UTC du serveur. Pour une ville très en avance ou en retard sur UTC, une limite de date peut différer d'un jour autour de minuit.
- Les unités (`°C`, `mm`, `km/h`, `%`) sont celles renvoyées par Open-Meteo.
- Les requêtes de test sont dans la collection Postman du dossier `docs/`.