"use strict";
const express = require("express");
const { authJwt } = require("../middlewares");
const forwardEmailController = require("../controllers/forward-email.controller");
const router = express.Router();

router.get(
  "/forward-email/:userId",
  [authJwt.verifyToken],
  forwardEmailController.getAll
);

module.exports = router;
