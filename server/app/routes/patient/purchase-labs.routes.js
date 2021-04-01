const express = require("express");
const { authJwt } = require("../../middlewares");
const PurchaseLabsController = require("../../controllers/patient/purchase-labs.controller");

const router = express.Router();

router.get(
  "/patient-portal/purchase-labs",
  [authJwt.verifyToken],
  PurchaseLabsController.getPurchaseLabs
);

module.exports = router;
