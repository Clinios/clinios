"use strict";
const express = require("express");
const { authJwt } = require("../middlewares");
const users = require("../controllers/users.controller");
const fieldValidation = require("../helpers/fieldValidation");
const router = express.Router();

router.get(
    "/users",
    [authJwt.verifyToken],
    users.getAll
);

router.get(
    "/users/forward", 
    [authJwt.verifyToken],
    users.getForward
);

router.post(
    "/users",
    [fieldValidation.validate("User"), authJwt.verifyToken],
    users.create
);

router.put(
    "/users/:userId",
    [authJwt.verifyToken],
    users.update
);

module.exports = router;
