const request = require("supertest");
const chaiHttp = require("chai-http");
const chai = require("chai");
const app = require("../../server/server");
const mongoose = require("mongoose");

const { Program } = require("../../server/class/Models/Models");

// Configure chai
chai.use(chaiHttp);
const { expect } = chai;


const dataSet = require("../setup/data");
const { authenticateUser } = require("../setup/utils");

describe("Test du routage de /Programmes", function () {
    describe("Test les routes /Programmes/** GET sans authentification", function () {
        it('route "/Programmes" -> retourne status Redirect (302) sur /Login', (done) => {
            request(app)
                .get("/Programmes")
                .expect(302)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.text).to.be.equal("Found. Redirecting to /Login");
                    done();
                });
        });

        it('route "/Programmes/Create" -> retourne status Redirect (302) sur /Login', (done) => {
            request(app)
                .get("/Programmes/Create")
                .expect(302)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.text).to.be.equal("Found. Redirecting to /Login");
                    done();
                });
        });
    });

    describe("Test les routes /Programmes/** POST sans authentification", function () {
        it('route "/Programmes/Create" -> retourne status Redirect (302) sur /Login', (done) => {
            request(app)
                .post("/Programmes/Create")
                .expect(302)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.text).to.be.equal("Found. Redirecting to /Login");
                    done();
                });
        });

        it('route "/Programmes/AddSearcher/:programId" (avec mauvaises infos) -> retourne status Redirect (302) sur /Login', (done) => {
            request(app)
                .post(`/Programmes/AddSearcher/${dataSet.fakeId}`)
                .expect(302)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.text).to.be.equal("Found. Redirecting to /Login");
                    done();
                });
        });

        it('route "/Programmes/AddSearcher/:programId" (avec bonnes infos) -> retourne status Redirect (302) sur /Login', (done) => {
            request(app)
                .post(`/Programmes/AddSearcher/${dataSet.program._id}`)
                .expect(302)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.text).to.be.equal("Found. Redirecting to /Login");
                    done();
                });
        });

        it('route "/Programmes/Delete/:programId" (avec mauvaises infos) -> retourne status Redirect (302) sur /Login', (done) => {
            request(app)
                .post(`/Programmes/Delete/${dataSet.fakeId}`)
                .expect(302)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.text).to.be.equal("Found. Redirecting to /Login");
                    done();
                });
        });

        it('route "/Programmes/Delete/:programId" (avec bonnes infos) -> retourne status Redirect (302) sur /Login', (done) => {
            request(app)
                .post(`/Programmes/Delete/${dataSet.program._id}`)
                .expect(302)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.text).to.be.equal("Found. Redirecting to /Login");
                    done();
                });
        });
    });

    describe("Test les routes /Programmes/** GET avec authentification", function () {
        let session = null;

        before((done) => {
            authenticateUser({ email: dataSet.searcher1.email, password: dataSet.uncryptedPassword }, app)
                .then((authentificatedSession) => {
                    session = authentificatedSession;
                    done();
                })
                .catch(done);
        });

        it('route "/Programmes" -> retourne status OK (200)', (done) => {
            session
                .get("/Programmes")
                .expect(200)
                .end((err) => {
                    if (err) return done(err);
                    done();

                    // todo -> ajouter des tests pour voir si les programmes s'affichent bien
                });
        });

        it('route "/Programmes/Create" -> retourne status OK (200)', (done) => {
            session.get("/Programmes/Create").expect(200, done);
        });
    });

    describe("Test les routes /Programmes/** POST avec authentification", function () {
        var session = null;
        const newDummyProgram = dataSet.dummyGenerateData.program();

        before((done) => {
            authenticateUser({ email: dataSet.searcher1.email, password: dataSet.uncryptedPassword }, app)
                .then((authentificatedSession) => {
                    session = authentificatedSession;
                    done();
                })
                .catch(done);
        });

        it(`route /Programmes/Create (avec mauvaises infos) -> OK (200) (échec)`, (done) => {
            session.post("/Programmes/Create").expect(200, done);
        });

        it(`route /Programmes/Create (avec bonnes infos) -> retourne status Redirect (302) (succès)`, (done) => {
            session.post("/Programmes/Create").send(newDummyProgram).expect(302, done);
        });

        it('route "/Programmes/AddSearcher/:programId" (avec bonnes infos) -> retourne status Redirect (302) sur /Programmes (succès)', (done) => {
            Program.findOne({ name: newDummyProgram.name, description: newDummyProgram.description }, (err, res) => {
                if (err) return done(err);
                if (!res) return done("Le programme n'existe pas alors qu'il devrait");

                session
                    .post(`/Programmes/AddSearcher/${res._id}`)
                    .send({ email: dataSet.searcher2.email })
                    .expect(302)
                    .end((err, res) => {
                        if (err) return done(err);

                        expect(res.text).to.be.equal("Found. Redirecting to /Programmes");
                        done();
                    });
            });
        });

        it('route "/Programmes/AddSearcher/:programId" (avec mauvaises infos) -> retourne status OK (200) (échec)', (done) => {
            Program.findOne({ name: newDummyProgram.name, description: newDummyProgram.description }, (err, res) => {
                if (err) return done(err);
                if (!res) return done("Le programme n'existe pas alors qu'il devrait");

                session
                    .post(`/Programmes/AddSearcher/${res._id}`)
                    .send({ email: dataSet.dummyGenerateData.searcher().email })
                    .expect(200, done);
            });
        });

        it('route "/Programmes/Delete/:programId" (avec mauvaises infos) -> OK (200) (échec)', (done) => {
            session.post(`/Programmes/Delete/${dataSet.fakeId}`).expect(200, done);
        });

        it('route "/Programmes/Delete/:programId" (avec bonnes infos) -> retourne status Redirect (302) sur /Programmes (succès)', (done) => {
            Program.findOne({ name: newDummyProgram.name, description: newDummyProgram.description }, (err, res) => {
                if (err) return done(err);
                if (!res) return done("Le programme n'existe pas alors qu'il devrait");

                session
                    .post(`/Programmes/Delete/${res._id}`)
                    .expect(302)
                    .end((err, res) => {
                        if (err) return done(err);

                        expect(res.text).to.be.equal("Found. Redirecting to /Programmes");
                        done();
                    });
            });
        });
    });
});
