const express = require("express");
const { authJwt } = require("../middlewares");
const StatusController = require("../controllers/database-status.controller");

const router = express.Router();

router.get(
  "/database-status",
  [authJwt.verifyToken],
  StatusController.getDatabaseStatus
);

module.exports = router;