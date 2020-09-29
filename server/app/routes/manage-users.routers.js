"use strict";
const express = require("express");
const { authJwt } = require("../middlewares");
const Manageusers = require("../controllers/manage-users.controller");
const fieldValidation = require("../helpers/fieldValidation");
const router = express.Router();

router.get(
    "/manage-users",
    [authJwt.verifyToken],
    Manageusers.getAll
);

router.get(
    "/manage-users/forward", 
    [authJwt.verifyToken],
    Manageusers.getForward
);

router.post(
    "/manage-users",
    [fieldValidation.validate("manageUser"), authJwt.verifyToken],
    Manageusers.create
);

router.put(
    "/manage-users/:userId",
    [authJwt.verifyToken],
    Manageusers.update
);

module.exports = router;
