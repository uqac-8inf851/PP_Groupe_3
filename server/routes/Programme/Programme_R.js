var express = require("express");

const ProgrammeDAO = require("../../class/Dao/ProgrammeDAO");

var router = express.Router();

router.get("/", (req, res) => {
    new ProgrammeDAO()
        .findAllByUserId(req.session.searcherId)
        .then((programmes) => {
            res.render("index.ejs", {
                Programmes: programmes,
                template: "./Programme/Programme",
            });
        })
        .catch((err) => {
            console.error(err);
            res.render("index.ejs", {
                template: "./Utils/Error",
                err,
            });
        });
});

router.get("/Create", (req, res) => {
    res.render("index.ejs", { template: "./Programme/ProgrammeCreate" });
});

router.post("/Create", (req, res) => {
    const { name, description } = req.body;
    new ProgrammeDAO()
        .create(name, description, req.session.searcherId)
        .then(() => {
            res.redirect("/Programmes");
        })
        .catch((err) => {
            console.error(err);
            res.render("index.ejs", {
                template: "./Utils/Error",
                err,
            });
        });
});

router.post("/AddSearcher/:programId", (req, res) => {
    new ProgrammeDAO()
        .addSearcherToProgramme(req.body.email,req.params.programId)
        .then(() => {
            return res.redirect("/Programmes");
        })
        .catch((err) => {
            console.error(err);
            res.render("index.ejs", {
                template: "./Utils/Error",
                err,
            });
        });
});

router.post("/delete/:id", (req, res) => {
    new ProgrammeDAO()
        .delete(req.params.id)
        .then(() => {
            res.redirect("/Programmes");
        })
        .catch((err) => {
            console.error(err);
            res.render("index.ejs", {
                template: "./Utils/Error",
                err,
            });
        });
});

module.exports = router;
