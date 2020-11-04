const request = require("supertest");
const chaiHttp = require("chai-http");
const chai = require("chai");
const app = require("../../server/server");

// Configure chai
chai.use(chaiHttp);
const { expect } = chai;

const dataSet = require("../setup/data");

describe("Test du routage de /Login", function () {
    describe("Test route /Login GET", function () {
        it("retourne status OK (200)", (done) => {
            request(app).get("/Login").expect(200, done);
        });
    });

    describe("Test route /Login POST", function () {
        const fakeCredentials = { email: "fake@fake.com", password: "fake" };

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
                .send(fakeCredentials)
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
                .send({ email: dataSet.searcher1.email, password: dataSet.uncryptedPassword })
                .expect(302)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.text).to.be.equal("Found. Redirecting to /Programmes");

                    // test présence cookie
                    expect(res.res.headers).to.have.property("set-cookie");
                    expect(res.res.headers["set-cookie"].filter((elem) => elem.includes("session")).length > 0).to.be
                        .true;

                    done();
                });
        });
    });
});
