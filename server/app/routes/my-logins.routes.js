"use strict";
const express = require("express");
const { authJwt } = require("../middlewares");
const myLoginsController = require("../controllers/my-logins.controller");
const router = express.Router();

router.get("/my-logins/:userId", [authJwt.verifyToken], myLoginsController.get);

module.exports = router;
