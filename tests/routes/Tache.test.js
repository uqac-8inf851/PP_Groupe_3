const request = require("supertest");
const chaiHttp = require("chai-http");
const chai = require("chai");
const app = require("../../server/server");
const mongoose = require("mongoose");

const { Task } = require("../../server/class/Models/Models");

// Configure chai
chai.use(chaiHttp);
const { expect } = chai;

const dataSet = require("../setup/data");
const { authenticateUser } = require("../setup/utils");

describe("Test du routage de /Tache", function () {
    describe("Test les routes /Tache/** GET sans authentification", function () {
        it('route "/Tache" -> retourne status Redirect (302) sur /Login', (done) => {
            request(app)
                .get("/Tache")
                .expect(302)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.text).to.be.equal("Found. Redirecting to /Login");
                    done();
                });
        });

        it('route "/Tache/Create/:projectId" (avec mauvaises infos) -> retourne status Redirect (302) sur /Login', (done) => {
            request(app)
                .get(`/Tache/Create/${dataSet.fakeId}`)
                .expect(302)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.text).to.be.equal("Found. Redirecting to /Login");
                    done();
                });
        });

        it('route "/Tache/Create/:projectId" (avec bonnes infos) -> retourne status Redirect (302) sur /Login', (done) => {
            request(app)
                .get(`/Tache/Create/${dataSet.project._id}`)
                .expect(302)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.text).to.be.equal("Found. Redirecting to /Login");
                    done();
                });
        });
    });

    describe("Test les routes /Tache/** POST sans authentification", function () {
        it('route "/Tache/Create" -> retourne status Redirect (302) sur /Login', (done) => {
            request(app)
                .post("/Tache/Create")
                .expect(302)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.text).to.be.equal("Found. Redirecting to /Login");
                    done();
                });
        });

        it('route "/Tache/AddSearcher/:taskId" (avec mauvaises infos) -> retourne status Redirect (302) sur /Login', (done) => {
            request(app)
                .post(`/Tache/AddSearcher/${dataSet.fakeId}`)
                .expect(302)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.text).to.be.equal("Found. Redirecting to /Login");
                    done();
                });
        });

        it('route "/Tache/AddSearcher/:taskId" (avec bonnes infos) -> retourne status Redirect (302) sur /Login', (done) => {
            request(app)
                .post(`/Tache/AddSearcher/${dataSet.task._id}`)
                .expect(302)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.text).to.be.equal("Found. Redirecting to /Login");
                    done();
                });
        });

        it('route "/Tache/Delete/:taskId" (avec mauvaises infos) -> retourne status Redirect (302) sur /Login', (done) => {
            request(app)
                .post(`/Tache/Delete/${dataSet.fakeId}`)
                .expect(302)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.text).to.be.equal("Found. Redirecting to /Login");
                    done();
                });
        });

        it('route "/Tache/Delete/:taskId" (avec bonnes infos) -> retourne status Redirect (302) sur /Login', (done) => {
            request(app)
                .post(`/Tache/Delete/${dataSet.task._id}`)
                .expect(302)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.text).to.be.equal("Found. Redirecting to /Login");
                    done();
                });
        });
    });

    describe("Test les routes /Tache/** GET avec authentification", function () {
        let session = null;

        before((done) => {
            authenticateUser({ email: dataSet.searcher1.email, password: dataSet.uncryptedPassword }, app)
                .then((authentificatedSession) => {
                    session = authentificatedSession;
                    done();
                })
                .catch(done);
        });

        it('route "/Tache" -> retourne status OK (200)', (done) => {
            session
                .get("/Tache")
                .expect(200)
                .end((err) => {
                    if (err) return done(err);
                    done();

                    // todo -> ajouter des tests pour voir si les tâches s'affichent bien
                });
        });

        // todo 'route "/Tache/Create/:projectId" (avec mauvaises infos)

        it('route "/Tache/Create/:projectId" (avec bonnes infos) -> retourne status OK (200)', (done) => {
            session.get(`/Tache/Create/${dataSet.project._id}`).expect(200, done);
        });
    });

    describe("Test les routes /Tache/** POST avec authentification", function () {
        var session = null;
        const newDummyTask = dataSet.dummyGenerateData.task();

        before((done) => {
            authenticateUser({ email: dataSet.searcher1.email, password: dataSet.uncryptedPassword }, app)
                .then((authentificatedSession) => {
                    session = authentificatedSession;
                    done();
                })
                .catch(done);
        });

        it(`route /Tache/Create (avec mauvaises infos) -> OK (200) (échec)`, (done) => {
            session.post("/Tache/Create").expect(200, done);
        });

        it(`route /Tache/Create (avec bonnes infos) -> retourne status Redirect (302) (succès)`, (done) => {
            session
                .post("/Tache/Create")
                .send({ ...newDummyTask, projectId: dataSet.project._id })
                .expect(302, done);
        });

        it(`route /Tache/AddSearcher/:taskId (avec bonnes infos) -> retourne status Redirect (302) sur /Tache (succès)`, (done) => {
            Task.findOne({ name: newDummyTask.name, note: newDummyTask.note }, (err, res) => {
                if (err) return done(err);
                if (!res) return done("La tâche n'existe pas alors qu'elle devrait");

                session
                    .post(`/Tache/AddSearcher/${res._id}`)
                    .send({ email: dataSet.searcher2.email })
                    .expect(302)
                    .end((err, res) => {
                        if (err) return done(err);

                        expect(res.text).to.be.equal("Found. Redirecting to /Tache");
                        done();
                    });
            });
        });

        it(`route /Tache/AddSearcher/:taskId (avec mauvaises infos) -> retourne status OK (200) (échec)`, (done) => {
            Task.findOne({ name: newDummyTask.name, note: newDummyTask.note }, (err, res) => {
                if (err) return done(err);
                if (!res) return done("La tâche n'existe pas alors qu'elle devrait");

                session
                    .post(`/Tache/AddSearcher/${res._id}`)
                    .send({ email: dataSet.dummyGenerateData.searcher().email })
                    .expect(200, done);
            });
        });

        it(`route /Tache/Delete/:taskId (avec mauvaises infos) -> OK (200) (échec)`, (done) => {
            session.post(`/Tache/Delete/${dataSet.fakeId}`).expect(200, done);
        });

        it(`route /Tache/Delete/:taskId (avec bonnes infos) -> retourne status Redirect (302) sur /Tache (succès)`, (done) => {
            Task.findOne({ name: newDummyTask.name, note: newDummyTask.note }, (err, res) => {
                if (err) return done(err);
                if (!res) return done("La tâche n'existe pas alors qu'elle devrait");

                session
                    .post(`/Tache/Delete/${res._id}`)
                    .expect(302)
                    .end((err, res) => {
                        if (err) return done(err);

                        expect(res.text).to.be.equal("Found. Redirecting to /Tache");
                        done();
                    });
            });
        });
    });
});
