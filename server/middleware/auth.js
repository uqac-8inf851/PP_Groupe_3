const { Searcher } = require("../class/Models/Models");

module.exports = (req, res, next) => {
    if (!(req.session && req.session.searcherId)) return res.redirect("/Login");

    Searcher.findById(req.session.searcherId, (err, searcher) => {
        if (err) {
            console.error(err);
            return res.redirect("/Login");
        }

        if (!searcher) return res.redirect("/Login");

        next(); // si tout est bon
    });
};
