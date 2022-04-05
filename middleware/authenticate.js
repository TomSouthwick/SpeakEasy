const jwt = require("jsonwebtoken");

const secret = process.env.ACCESS_TOKEN_SECRET;
const expiration = "2hrs";

module.exports = {
  authenticate: function (req, res, next) {
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    if (!token) {
      res.redirect("/login");
      return res.status(401).json({ msg: "You must be logged in to continue" });
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      // req.user = data;
      next();
    } catch {
      return res.status(401).json({ msg: "Incorrect token." });
    }
  },
};
