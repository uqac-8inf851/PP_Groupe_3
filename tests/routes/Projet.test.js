const request = require("supertest");
const chaiHttp = require("chai-http");
const chai = require("chai");
const app = require("../../server/server");
const mongoose = require("mongoose");

const { Project } = require("../../server/class/Models/Models");

// Configure chai
chai.use(chaiHttp);
const { expect } = chai;

const dataSet = require("../setup/data");
const { authenticateUser } = require("../setup/utils");

describe("Test du routage de /Projet", function () {
    describe("Test les routes /Projet/** GET sans authentification", function () {
        it('route "/Projet" -> retourne status Redirect (302) sur /Login', (done) => {
            request(app)
                .get("/Projet")
                .expect(302)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.text).to.be.equal("Found. Redirecting to /Login");
                    done();
                });
        });

        it('route "/Projet/Create/:programId" (avec mauvaises infos) -> retourne status Redirect (302) sur /Login', (done) => {
            request(app)
                .get(`/Projet/Create/${dataSet.fakeId}`)
                .expect(302)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.text).to.be.equal("Found. Redirecting to /Login");
                    done();
                });
        });

        it('route "/Projet/Create/:programId" (avec bonnes infos) -> retourne status Redirect (302) sur /Login', (done) => {
            request(app)
                .get(`/Projet/Create/${dataSet.program._id}`)
                .expect(302)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.text).to.be.equal("Found. Redirecting to /Login");
                    done();
                });
        });
    });

    describe("Test les routes /Projet/** POST sans authentification", function () {
        it('route "/Projet/Create" -> retourne status Redirect (302) sur /Login', (done) => {
            request(app)
                .post("/Projet/Create")
                .expect(302)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.text).to.be.equal("Found. Redirecting to /Login");
                    done();
                });
        });

        it('route "/Projet/AddSearcher/:projectId" (avec mauvaises infos) -> retourne status Redirect (302) sur /Login', (done) => {
            request(app)
                .post(`/Projet/AddSearcher/${dataSet.fakeId}`)
                .expect(302)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.text).to.be.equal("Found. Redirecting to /Login");
                    done();
                });
        });

        it('route "/Projet/AddSearcher/:projectId" (avec bonnes infos) -> retourne status Redirect (302) sur /Login', (done) => {
            request(app)
                .post(`/Projet/AddSearcher/${dataSet.project._id}`)
                .expect(302)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.text).to.be.equal("Found. Redirecting to /Login");
                    done();
                });
        });

        it('route "/Projet/Delete/:projectId" (avec mauvaises infos) -> retourne status Redirect (302) sur /Login', (done) => {
            request(app)
                .post(`/Projet/Delete/${dataSet.fakeId}`)
                .expect(302)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.text).to.be.equal("Found. Redirecting to /Login");
                    done();
                });
        });

        it('route "/Projet/Delete/projectId" (avec bonnes infos) -> retourne status Redirect (302) sur /Login', (done) => {
            request(app)
                .post(`/Projet/Delete/${dataSet.project._id}`)
                .expect(302)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.text).to.be.equal("Found. Redirecting to /Login");
                    done();
                });
        });
    });

    describe("Test les routes /Projet/** GET avec authentification", function () {
        let session = null;

        before((done) => {
            authenticateUser({ email: dataSet.searcher1.email, password: dataSet.uncryptedPassword }, app)
                .then((authentificatedSession) => {
                    session = authentificatedSession;
                    done();
                })
                .catch(done);
        });

        it('route "/Projet" -> retourne status OK (200)', (done) => {
            session
                .get("/Projet")
                .expect(200)
                .end((err) => {
                    if (err) return done(err);
                    done();

                    // todo -> ajouter des tests pour voir si les projets s'affichent bien
                });
        });

        // todo 'route "/Projet/Create/:programId" (avec mauvaises infos)

        it('route "/Projet/Create/:programId" (avec bonnes infos) -> retourne status OK (200)', (done) => {
            session.get(`/Projet/Create/${dataSet.program._id}`).expect(200, done);
        });
    });

    describe("Test les routes /Projet/** POST avec authentification", function () {
        var session = null;
        const newDummyProject = dataSet.dummyGenerateData.project();

        before((done) => {
            authenticateUser({ email: dataSet.searcher1.email, password: dataSet.uncryptedPassword }, app)
                .then((authentificatedSession) => {
                    session = authentificatedSession;
                    done();
                })
                .catch(done);
        });

        it('route "/Projet/Create" (avec mauvaises infos) -> OK (200) (échec)', (done) => {
            session.post("/Projet/Create").expect(200, done);
        });

        it('route "/Projet/Create" (avec bonnes infos) -> retourne status Redirect (302) (succès)', (done) => {
            session
                .post("/Projet/Create")
                .send({ ...newDummyProject, programId: dataSet.program._id })
                .expect(302, done);
        });

        //todo => "/Projet/AddSearcher/:projectId" (avec mauvaises infos)

        it('route "/Projet/AddSearcher/:projectId" (avec bonnes infos) -> retourne status Redirect (302) sur /Projet (succès)', (done) => {
            Project.findOne({ name: newDummyProject.name, description: newDummyProject.description }, (err, res) => {
                if (err) return done(err);
                if (!res) return done("Le projet n'existe pas alors qu'il devrait");

                session
                    .post(`/Projet/AddSearcher/${res._id}`)
                    .send({ email: dataSet.searcher2.email })
                    .expect(302)
                    .end((err, res) => {
                        if (err) return done(err);

                        expect(res.text).to.be.equal("Found. Redirecting to /Projet");
                        done();
                    });
            });
        });

        it('route "/Projet/AddSearcher/:projectId" (avec mauvaises infos) -> retourne status OK (200) (échec)', (done) => {
            Project.findOne({ name: newDummyProject.name, description: newDummyProject.description }, (err, res) => {
                if (err) return done(err);
                if (!res) return done("Le projet n'existe pas alors qu'il devrait");

                session
                    .post(`/Projet/AddSearcher/${res._id}`)
                    .send({ email: dataSet.dummyGenerateData.searcher().email })
                    .expect(200, done);
            });
        });

        it('route "/Projet/Delete/:projectId" (avec mauvaises infos) -> OK (200) (échec)', (done) => {
            session.post(`/Projet/Delete/${dataSet.fakeId}`).expect(200, done);
        });

        it('route "/Projet/Delete/:projectId" (avec bonnes infos) -> retourne status Redirect (302) sur /Projet (succès)', (done) => {
            Project.findOne({ name: newDummyProject.name, description: newDummyProject.description }, (err, res) => {
                if (err) return done(err);
                if (!res) return done("Le projet n'existe pas alors qu'il devrait");

                session
                    .post(`/Projet/Delete/${res._id}`)
                    .expect(302)
                    .end((err, res) => {
                        if (err) return done(err);

                        expect(res.text).to.be.equal("Found. Redirecting to /Projet");
                        done();
                    });
            });
        });
    });
});

// // get "/" (avec et sans authentification)
// // get "/Create/:projectId" (avec et sans authentification) + (avec et sans bon paramètre)
// // post "/Create" (avec et sans authentification) + (avec et sans bon paramètres)
// // post "/AddSearcher/:taskId" (avec et sans authentification) + (avec et sans bon paramètres)
// // post "/Delete/:id" (avec et sans authentification) + (avec et sans bon paramètres)
