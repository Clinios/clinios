const express = require("express");
const { authJwt } = require("../middlewares");
const Users = require("../controllers/test-postgress.controller");

const router = express.Router();

router.get("/postgress-users", [authJwt.verifyToken], Users.getAllUsers);


module.exports = router;
