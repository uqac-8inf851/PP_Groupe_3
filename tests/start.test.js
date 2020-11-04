// START TESTS

// Setup l'environnement de test
require("./setup/setup");

// test des routes
require("./routes/Register.test");
require("./routes/Login.test");
require("./routes/Programme.test");
require("./routes/Projet.test");
require("./routes/Tache.test");
require("./routes/Routes.test");

// tests des scripts
require("./scripts/utils.test");
