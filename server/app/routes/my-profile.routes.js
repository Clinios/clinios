"use strict";
const express = require("express");
const { authJwt } = require("../middlewares");
const myProfileController = require("../controllers/my-profile.controller");
const router = express.Router();

router.get(
  "/my-profile/:userId",
  [authJwt.verifyToken],
  myProfileController.get
);

router.put(
  "/my-profile/:userId",
  [authJwt.verifyToken],
  myProfileController.update
);

module.exports = router;
