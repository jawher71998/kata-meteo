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

À compléter au fil du projet.

## Avancement

- [x] Phase 0 : préparation
- [x] Phase 1 : découverte de l'API Open-Meteo
- [ ] Phase 2 : base de données
- [ ] Phase 3 : backend REST
- [ ] Phase 4 : frontend
- [ ] Phase 5 : tests et qualité
- [ ] Phase 6 : livraison

## Conventions

- Branches : `type/description-courte` (ex. `feature/cities-endpoint`)
- Commits : Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `test:`)
- Aucun commit direct sur `main` : tout passe par une Pull Request