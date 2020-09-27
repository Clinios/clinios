"use strict";
const express = require("express");
const { authJwt } = require("../middlewares");
const myActivityHistoryController = require("../controllers/my-activity-history.controller");
const router = express.Router();

router.get(
  "/patient/:userId",
  [authJwt.verifyToken],
  myActivityHistoryController.get
);

module.exports = router;
