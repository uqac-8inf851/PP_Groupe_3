# Projet Pratique Groupe 3

Ce répertoire contient les sources pour le projet pratique du cours de Génie Logiciel du groupe 3

## Configuration du projet (+ lancement)

### Pré-requis

1. Installer NodeJS ([la version la plus récente](https://nodejs.org/en/download/))
1. Installer MongoDB
    1. (optionnel) Ajouter MongoDB au PATH pour pouvoir executer les commandes mongoDB dans le bash (variable d'environnement : [tuto](http://sysadmindata.com/set-mongodb-path-windows/))

### Installation du projet

1. Cloner le projet
1. Executer `npm install` à la racine du dossier pour installer les modules NPM

### Lancement du projet

1. Lancer la base de donnée MongoDB (avec la commande `mongod --dbpath=database/` lancée depuis la racine du serveur **ou** en lançant l'executable depuis le dossier *bin* de MongoDB)
1. Lancer le serveur NodeJS en executant la commande `npm run debug` depuis la racine du projet
1. Ouvrez votre navigateur à l'adresse indiquer par les logs de votre console ayant lancée le programme (normalement *http://localhost:5500/*)

### Tester le projet

**Note :** Les tests unitaires et d'intégration n'ont qu'une couverture partielle du projet car l'équipe ne savait comment en faire une plus complète

- Lancer la commande `npm run test` pour déclencher les tests du projet avec le framework Mocha

## Principales technologies utilisées dans le projet

- [NodeJS](https://nodejs.org/en/) (avec [Express](https://expressjs.com/fr/))
- [MongoDB](https://www.mongodb.com/fr) (avec [Mangoose](https://mongoosejs.com/docs/))
- [Mocha](https://mochajs.org/) (pour les tests avec [Chai](https://www.chaijs.com/))
- [EJS](https://ejs.co/) (pour le rendu html côté serveur)