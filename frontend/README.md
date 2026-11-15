# Frontend KATA Météo

Interface web de l'application, en React et TypeScript, construite avec Vite.

## Lancer le frontend

Le backend doit tourner sur le port 3000 (voir le README principal).

```
npm install
npm run dev
```

L'application est disponible sur `http://localhost:5173`. En développement, Vite transmet au backend toute requête commençant par `/api` (proxy configuré dans `vite.config.ts`) : le frontend n'a donc aucune adresse d'API en dur.

## Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Vérification des types TypeScript et compilation |
| `npm run lint` | Contrôle de style (Oxlint) |
| `npm run preview` | Aperçu de la version compilée |

## Structure

```
src/
├── api/          types des réponses et client HTTP (seul endroit qui appelle l'API)
├── components/   LocationPicker, WeatherForm, WeatherResults, WeatherCard, CategoryFilter
├── hooks/        useWeather : états chargement, erreur, succès
├── lib/          fonctions pures : dates, validation et construction de la requête,
│                 transformation des réponses, pictogrammes, catégories
├── App.tsx       assemble les composants et porte l'état (ville, requête, catégories)
└── index.css     feuille de style unique (thème clair et sombre automatiques)
```

## Choix de conception

- **Validation en deux temps** : le formulaire valide la saisie pour le confort de l'utilisateur ; le backend revalide toujours, car il est la vraie protection.
- **Une donnée absente n'est jamais un zéro** : elle s'affiche « Non disponible ».
- **Filtrage par catégorie côté interface** : les données sont déjà reçues, changer le filtre ne rappelle pas l'API.
- **Les trois modes (actuelle, historique, prévisions)** sont transformés en une même forme de carte (`WeatherItem`) avant l'affichage.
- **Les dates utilisent UTC**, comme le backend, pour que « aujourd'hui » soit identique des deux côtés.

## Accessibilité

Étiquettes associées à chaque champ, messages d'erreur annoncés (`role="alert"`), chargement annoncé (`role="status"`), pictogrammes décrits par leur condition, focus visible et navigation complète au clavier.

## Source des données

Données météo : [Open-Meteo.com](https://open-meteo.com/).