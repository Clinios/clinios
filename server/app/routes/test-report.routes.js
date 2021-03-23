const express = require("express");
const { authJwt } = require("../middlewares");
const testReports = require("../controllers/test-report.controller.js");

const router = express.Router();

router.get("/tests", [authJwt.verifyToken], testReports.getFunctionalRange);
router.get(
  "/tests/page-title/:cptId",
  [authJwt.verifyToken],
  testReports.getPageTitle
);
router.get(
  "/tests/lab-cpt/:patientId/:labId",
  [authJwt.verifyToken],
  testReports.getLabcptByLabId
);
router.get(
  "/tests/lab-cpt/:patientId/lab/:labId",
  [authJwt.verifyToken],
  testReports.getLabcptByLabId
);
router.get(
  "/tests/lab-cpt/:patientId",
  [authJwt.verifyToken],
  testReports.getLabcpt
);
router.get(
  "/tests/graph/:patientId/:labId",
  [authJwt.verifyToken],
  testReports.getTestGraph
);

module.exports = router;
