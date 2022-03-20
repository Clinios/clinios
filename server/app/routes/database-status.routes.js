const express = require("express");
const StatusController = require("../controllers/database-status.controller");

const router = express.Router();

router.get(
  "/database-status",
  StatusController.getDatabaseStatus
);

module.exports = router;