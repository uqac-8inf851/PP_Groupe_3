# Projet Pratique Groupe 3

Ce répertoire contient les sources pour le projet pratique du cours de Génie Logiciel du groupe 3

[![BCH compliance](https://bettercodehub.com/edge/badge/uqac-8inf851/PP_Groupe_3?branch=main&token=af6e898e99eda64b951d2b91d05064d96240efb4)](https://bettercodehub.com/)

## Configuration du projet (+ lancement)

### Pré-requis

1. Installer NodeJS ([la version la plus récente](https://nodejs.org/en/download/)) en vous assurant d'installer npm (normalement vient par défaut avec NodeJS)
1. Installer MongoDB Community Edition ([ici](https://docs.mongodb.com/manual/administration/install-community/))

### Installation du projet

1. Cloner le projet avec la commande `git clone https://github.com/uqac-8inf851/PP_Groupe_3.git` (attention la branche principale s'appelle `main`)
1. Executer `npm install` à la racine du dossier pour installer les modules NPM

### Lancement du projet

1. Lancer le serveur NodeJS en executant la commande `npm run debug` (en version dévelopemment) ou `npm run start` (en version production) depuis la racine du projet
1. Ouvrez votre navigateur à l'adresse indiquée par les logs de votre console ayant lancée le programme (normalement `http://localhost:5500/`)

### Tester le projet

**Note :** Les tests unitaires et d'intégration n'ont qu'une couverture partielle du projet car l'équipe est novice dans l'écriture de tests.

-   Lancer la commande `npm run test` pour déclencher les tests du projet avec le framework Mocha
-   **OU** Lancer la commande `npm run coverage` pour ovtenir en plus des tests une converture complète et détaillée (que vous pourrez retrouver en ouvrant /coverage/index.html à la racine du projet)

## Principales technologies utilisées dans le projet

-   [NodeJS](https://nodejs.org/en/) (avec [Express](https://expressjs.com/fr/))
-   [MongoDB](https://www.mongodb.com/fr) (avec [Mangoose](https://mongoosejs.com/docs/))
-   [Mocha](https://mochajs.org/) (pour les tests avec [Chai](https://www.chaijs.com/))
-   [EJS](https://ejs.co/) (pour le rendu html côté serveur)
-   [Winston](https://github.com/winstonjs/winston) (pour le logging avec [winston-logio](https://github.com/jaakkos/winston-logio) pour l'affichage des logs en production)
-   [Prettier](https://prettier.io/) (pour le formattage automatique du code)
-   [ESLint](https://eslint.org/) (pour les bases du clean coding en JS)
-   [Github Action](https://github.com/features/actions) (pour l'intégration continue)
