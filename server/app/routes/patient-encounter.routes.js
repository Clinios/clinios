const express = require("express");
const { authJwt } = require("../middlewares");
const PatientEncounter = require("../controllers/patient-encounter.controller.js");

const router = express.Router();

/** encounters */
router.get(
  "/patient/:patient_id/encounters",
  [authJwt.verifyToken],
  PatientEncounter.getEncounters
);
router.post(
  "/patient/:patient_id/encounters",
  [authJwt.verifyToken],
  PatientEncounter.createEncounter
);
router.put(
  "/patient/:patient_id/encounters/:id",
  [authJwt.verifyToken],
  PatientEncounter.updateEncounter
);
router.delete(
  "/patient/:patient_id/encounters/:id",
  [authJwt.verifyToken],
  PatientEncounter.deleteEncounter
);
router.get(
  "/patient/:patient_id/encounter-types",
  [authJwt.verifyToken],
  PatientEncounter.getEncounterTypes
);
router.get(
  "/patient/encounters/diagnoses/recent-diagnoses",
  [authJwt.verifyToken],
  PatientEncounter.getRecentDiagnoses
);
router.post(
  "/patient/encounters/prescriptions/search-drug",
  [authJwt.verifyToken],
  PatientEncounter.searchDrug
);
router.get(
  "/patient/encounters/recent-prescriptions",
  [authJwt.verifyToken],
  PatientEncounter.getEncountersPrescriptions
);
router.get(
  "/patient/encounters/prescriptions/frequencies",
  [authJwt.verifyToken],
  PatientEncounter.getEncountersPrescriptionsFrequencies
);
router.get(
  "/patient/encounters/prescriptions/edit",
  [authJwt.verifyToken],
  PatientEncounter.encountersPrescriptionsEdit
);
router.get(
  "/patient/encounters/recent-profiles",
  [authJwt.verifyToken],
  PatientEncounter.encountersRecentProfiles
);
router.post(
  "/patient/:patient_id/encounters-icd",
  [authJwt.verifyToken],
  PatientEncounter.createEncounter_ICD
);
router.get(
  "/patient/encounters/plan",
  [authJwt.verifyToken],
  PatientEncounter.getEncounterPlan
);
router.get(
  "/patient/encounters/prescription/search",
  [authJwt.verifyToken],
  PatientEncounter.getEncounterPlan
);
module.exports = router;
