const request = require("supertest");
const chaiHttp = require("chai-http");
const chai = require("chai");
const app = require("../../server/server");
const faker = require("faker");

// Configure chai
chai.use(chaiHttp);
const { expect } = chai;

const dataSet = require("../setup/data");
const { authenticateUser } = require("../setup/utils");

describe("Test du routage home /", function () {
    it("retourne status Redirect (302) sur /Programmes", (done) => {
        request(app)
            .get("/")
            .expect(302)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.text).to.be.equal("Found. Redirecting to /Programmes");
                done();
            });
    });
});

const randomeWord = [faker.lorem.word(), faker.lorem.word(), faker.lorem.word()].join(""); // mot aléatoire

describe(`Test d'un chemin innexistant /${randomeWord}`, function () {
    describe("Sans authentification", function () {
        it("retourne status Redirect (302) sur /Login", (done) => {
            request(app)
                .get(`/${randomeWord}`)
                .expect(302)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.text).to.be.equal("Found. Redirecting to /Login");
                    done();
                });
        });
    });

    describe("Avec authentification", function () {
        let session = null;

        before((done) => {
            authenticateUser({ email: dataSet.searcher1.email, password: dataSet.uncryptedPassword }, app)
                .then((authentificatedSession) => {
                    session = authentificatedSession;
                    done();
                })
                .catch(done);
        });

        it("retourne status Redirect (302) sur /", (done) => {
            session
                .get(`/${randomeWord}`)
                .expect(302)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.text).to.be.equal("Found. Redirecting to /");
                    done();
                });
        });
    });
});
