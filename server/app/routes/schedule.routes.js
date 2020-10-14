"use strict";
const express = require("express");
const { authJwt } = require("../middlewares");
const Schedule = require("../controllers/schedule.controller");
const router = express.Router();

router.get("/users", [authJwt.verifyToken], Schedule.getAllUser);
router.post("/schedule/search", [authJwt.verifyToken], Schedule.search);
router.post("/schedule", [authJwt.verifyToken], Schedule.createNewSchedule);
router.put(
  "/schedule/:userId/:scheduleId",
  [authJwt.verifyToken],
  Schedule.updateSchedule
);
router.delete("/schedule/:id", [authJwt.verifyToken], Schedule.deleteSchedule);

module.exports = router;
