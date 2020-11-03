const request = require("supertest");
const chaiHttp = require("chai-http");
const chai = require("chai");
const app = require("../../server/server");
const bcrypt = require("bcryptjs");

const { Searcher } = require("../../server/class/Models/Models");

// Configure chai
chai.use(chaiHttp);
const { expect } = chai;

describe("Test route /Login GET", function () {
    it("retourne status OK (200)", (done) => {
        request(app).get("/Login").expect(200, done);
    });
});

describe("Test route /Login POST", function () {
    const testUser = { email: "test@test.com", password: "1234", name: "John Doe" };
    const testCredentials = { email: testUser.email, password: testUser.password };
    const sampleUser = { email: "fake@fake.com", password: "fake" };

    // insère un utilisateur temp dans la base de donnée
    before("Insère utilisateur test", (done) => {
        const testUserComplete = { email: testUser.email, name: testUser.name };

        const salt = bcrypt.genSaltSync(10); // génération sel
        testUserComplete.password = bcrypt.hashSync(testUser.password, salt); // hachage du mot de passe

        Searcher.create(testUserComplete, (err, res) => {
            done(err);
        });
    });

    // supprime l'utilisateur
    after("Suppression utilisateur test", (done) => {
        Searcher.deleteOne({ email: testUser.email }, (err) => {
            done(err);
        });
    });

    it('Aucun identifiant et mot de passe saisit -> retourne status REDIRECT (302) sur "/Login"', (done) => {
        request(app)
            .post("/Login")
            .expect(302)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.text).to.be.equal("Found. Redirecting to /Login");
                done();
            });
    });

    it('Connexion avec mauvais identifiant mot de passe -> retourne status REDIRECT (302) sur "/Login"', (done) => {
        request(app)
            .post("/Login")
            .send(sampleUser)
            .expect(302)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.text).to.be.equal("Found. Redirecting to /Login");
                done();
            });
    });

    it('Connexion avec bon identifiant et mot de passe -> retourne status REDIRECT (302) sur "/Programmes" + ajout d\'un cookie', (done) => {
        request(app)
            .post("/Login")
            .send(testCredentials)
            .expect(302)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.text).to.be.equal("Found. Redirecting to /Programmes");

                // ajout du cookie de session dans la réponse
                expect(res.res.headers).to.have.property("set-cookie");
                expect(res.res.headers["set-cookie"].filter((elem) => elem.includes("session")).length > 0).to.be.true;

                done();
            });
    });
});
