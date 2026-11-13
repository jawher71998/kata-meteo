# KATA Météo

Application web de consultation météo : l'utilisateur choisit un pays, une ville et un mode (actuel, historique, prévisions), puis consulte les résultats avec pictogrammes.

## Stack technique

- **Base de données** : PostgreSQL
- **Backend** : Node.js, Express, TypeScript
- **Frontend** : React, TypeScript
- **Source météo** : API Open-Meteo

## Structure du projet

```
kata-meteo/
├── backend/    API REST
├── frontend/   Interface utilisateur
├── docs/       Documentation et collection Postman
└── README.md
```

## Prérequis

- Node.js 24 ou plus
- PostgreSQL 18
- Git

## Installation

1. Cloner le dépôt.
2. Copier `.env.example` en `.env` et renseigner `DB_PASSWORD`.
3. Mettre en place la base de données : voir `docs/database.md`.
4. Lancer le backend :

```
cd backend
npm install
npm run dev
```

L'API répond sur `http://localhost:3000` (test : `/api/health`).

## Documentation

- `docs/API.md` : référence de l'API (routes, paramètres, erreurs)
- `docs/database.md` : base de données
- `docs/open-meteo-findings.md` : résultats de l'exploration d'Open-Meteo
- `docs/kata-meteo-api.postman_collection.json` : requêtes de test Postman

## Avancement

- [x] Phase 0 : préparation
- [x] Phase 1 : découverte de l'API Open-Meteo
- [x] Phase 2 : base de données
- [x] Phase 3 : backend REST
- [ ] Phase 4 : frontend
- [ ] Phase 5 : tests et qualité
- [ ] Phase 6 : livraison

## Conventions

- Branches : `type/description-courte` (ex. `feature/cities-endpoint`)
- Commits : Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `test:`)
- Aucun commit direct sur `main` : tout passe par une Pull Request