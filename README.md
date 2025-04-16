# Tournament Manager - Frontend

Ce projet est le frontend pour l'application de gestion de tournois de jeux vidéo. Il est construit avec React et interagit avec une API backend Laravel.

## Fonctionnalités

- Authentification des utilisateurs (inscription, connexion, déconnexion)
- Affichage et gestion des tournois (liste, création, modification, suppression)
- Gestion des joueurs (ajout, suppression)
- Gestion des matchs (création, affichage des scores)
- Interface responsive et moderne avec Tailwind CSS

## Prérequis

- Node.js (v14 ou supérieur)
- npm ou yarn
- Backend API en cours d'exécution (projet Laravel)

## Installation

1. Clonez ce dépôt
2. Installez les dépendances:
```
npm install
```
3. Créez un fichier `.env` à la racine du projet et configurez les variables d'environnement:
```
VITE_API_URL=http://localhost:8000/api/v1
```

## Démarrage

Pour lancer l'application en mode développement:

```
npm run dev
```

L'application sera disponible à l'adresse [http://localhost:5173](http://localhost:5173).

## Construction pour la production

Pour construire l'application pour la production:

```
npm run build
```

Les fichiers de production seront générés dans le dossier `dist`.

## Structure du projet

```
src/
├── assets/        # Images, fichiers statiques
├── components/    # Composants réutilisables
├── context/       # Contextes React (AuthContext, etc.)
├── pages/         # Pages principales
├── services/      # Services API
├── utils/         # Fonctions utilitaires
├── App.jsx        # Composant principal
└── main.jsx       # Point d'entrée
```

## Tests

Pour exécuter les tests:

```
npm run test
```

## Utilisation

1. Créez un compte ou connectez-vous
2. Créez un nouveau tournoi en fournissant les détails nécessaires
3. Ajoutez des joueurs à votre tournoi
4. Créez des matchs entre les joueurs
5. Enregistrez les scores des matchs

## Développement

L'application est construite avec:

- React (UI)
- React Router (navigation)
- Tailwind CSS (styles)
- Axios (requêtes HTTP)
- Context API (gestion d'état)

## Licence

Ce projet est sous licence MIT.
