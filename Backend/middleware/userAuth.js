const jwt = require("jsonwebtoken");
const blacklist = require("../blacklist");
const User = require("../models/user.model");

const userAuth = {
  authT: (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];

    if (blacklist.includes(token)) {
      return res.status(400).send({ msg: "You're logout, please login" });
    }
    if (!token) {
      return res.status(401).send({ msg: "Invalid Token" });
    }
    
    jwt.verify(token, "codingrank", (err, decoded) => {
      if (err) {
        return res.status(401).send({ msg: "You're not authenticated person" });
      }
      //console.log(decoded)
      req.user = decoded;
      next();
    });
  },
  //reena - role-student, route(teacher)
  authR: (roles) => {
    return (req, res, next) => {
      if (roles.includes(req.user.role)) {
        next();
      } else {
        return res
          .status(403)
          .send({
            msg: "You're not authorized person to access this resource",
          });
      }
    };
  },
};

module.exports = userAuth;
