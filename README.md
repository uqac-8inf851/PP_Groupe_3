# Projet Pratique Groupe 3

Ce répertoire contient les sources pour le projet pratique du cours de Génie Logiciel du groupe 3

## Configuration du projet (+ lancement)

### Pré-requis

1. Installer NodeJS ([la version la plus récente](https://nodejs.org/en/download/))
1. Installer MongoDB

### Installation du projet

1. Cloner le projet
1. Executer `npm install` à la racine du dossier pour installer les modules NPM

### Lancement du projet

1. Lancer le serveur NodeJS en executant la commande `npm run debug` depuis la racine du projet
1. Ouvrez votre navigateur à l'adresse indiquer par les logs de votre console ayant lancée le programme (normalement _http://localhost:5500/_)

### Tester le projet

**Note :** Les tests unitaires et d'intégration n'ont qu'une couverture partielle du projet car l'équipe ne savait comment en faire une plus complète

-   Lancer la commande `npm run test` pour déclencher les tests du projet avec le framework Mocha

## Principales technologies utilisées dans le projet

-   [NodeJS](https://nodejs.org/en/) (avec [Express](https://expressjs.com/fr/))
-   [MongoDB](https://www.mongodb.com/fr) (avec [Mangoose](https://mongoosejs.com/docs/))
-   [Mocha](https://mochajs.org/) (pour les tests avec [Chai](https://www.chaijs.com/))
-   [EJS](https://ejs.co/) (pour le rendu html côté serveur)
-   [Winston](https://github.com/winstonjs/winston) (pour le logging avec [winston-logio](https://github.com/jaakkos/winston-logio) pour l'affichage des logs en production)
-   [Prettier](https://prettier.io/) (pour le formattage automatique du code)
-   [ESLint](https://eslint.org/) (pour les bases du clean coding en JS)

## Améliorations à faire

-   Système de logging
-   Améliorer les schémas (default, validation, etc)
-   Vérification des paramètres côté serveur à la reception avec [express-validator](https://express-validator.github.io/docs/check-api.html)
-   Validation des données dans les DAO (longueur, etc, ...)
-   Piste de reflexion pour le renvoi des erreurs au front : [stackoverflow](https://stackoverflow.com/questions/52341893/form-validation-and-displaying-error-message-using-ejs)

## Bugs

-   On peut ajouter deux fois le même chercheur à un programme, un projet ou une tâche
