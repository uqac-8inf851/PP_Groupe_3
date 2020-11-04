const request = require("supertest");
const chaiHttp = require("chai-http");
const chai = require("chai");
const app = require("../../server/server");

const { Searcher } = require("../../server/class/Models/Models");

// Configure chai
chai.use(chaiHttp);
const { expect } = chai;

describe("Test du routage de /Register", function () {
    describe("Test route /Register GET", function () {
        it("retourne status OK (200)", (done) => {
            request(app).get("/Register").expect(200, done);
        });
    });

    describe("Test route /Register POST", function () {
        const testUser = { email: "test@test.com", password: "1234", name: "John Doe" };
        const testUserFailure = { email: "test@test.com", password: "1234" };

        // supprime l'utilisateur ajouté
        after("Suppression utilisateur test", (done) => {
            Searcher.deleteOne({ email: testUser.email }, (err) => {
                done(err);
            });
        });

        it('Enregistrement avec aucune données envoyées -> retourne status REDIRECT (302) sur "/Register"', (done) => {
            request(app)
                .post("/Register")
                .expect(302)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.text).to.be.equal("Found. Redirecting to /Register");
                    done();
                });
        });

        it('Enregistrement avec données invalides envoyées -> retourne status REDIRECT (302) sur "/Register" + aucun chercheur créé en BD', (done) => {
            request(app)
                .post("/Register")
                .send(testUserFailure)
                .expect(302)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.text).to.be.equal("Found. Redirecting to /Register");

                    // pas d'utilisateur ajouté en BD
                    Searcher.findOne({ email: testUserFailure.email }, (errFind, resFind) => {
                        expect(errFind).to.be.null;
                        expect(resFind).to.be.null;
                        done();
                    });
                });
        });

        it('Enregistrement avec bonnes données -> retourne status REDIRECT (302) sur "/Login" + chercheur créé en BD', (done) => {
            request(app)
                .post("/Register")
                .send(testUser)
                .expect(302)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.text).to.be.equal("Found. Redirecting to /Login");

                    // utilisateur en BD
                    Searcher.findOne({ email: testUser.email }, (errFind, resFind) => {
                        expect(errFind).to.be.null;
                        expect(resFind).not.to.be.null;
                        done();
                    });
                });
        });
    });
});
