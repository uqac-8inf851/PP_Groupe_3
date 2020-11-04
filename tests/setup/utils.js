// CONTIENT LES FONCTIONS UTILES POUR LES TESTS

const request = require("supertest");
const session = require("supertest-session");

function authenticateUser(credentials, app) {
    return new Promise((resolve, reject) => {
        const testSession = session(app);

        testSession
            .post("/Login")
            .send(credentials)
            .end((err, res) => {
                if (err) return reject(err);

                return resolve(testSession);
            });
    });
}

module.exports = { authenticateUser };
