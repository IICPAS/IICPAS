const express = require("express");
const router = express.Router();
const {
  createTDSSimulation,
  getTDSSimulations,
  getTDSSimulation,
  updateTDSSimulation,
  deleteTDSSimulation,
  updateLearningProgress,
  validateTDSSimulation,
  generateTDSCertificate,
  generateTDSChallan,
  getTDSSimulationStats,
} = require("../controllers/tdsSimulationController");
const requireAuth = require("../middleware/requireAuth");

// Apply authentication middleware to all routes
router.use(requireAuth);

// TDS Simulation CRUD routes
router.post("/", createTDSSimulation);
router.get("/", getTDSSimulations);
router.get("/stats", getTDSSimulationStats);
router.get("/:id", getTDSSimulation);
router.put("/:id", updateTDSSimulation);
router.delete("/:id", deleteTDSSimulation);

// Learning and progress routes
router.patch("/:id/progress", updateLearningProgress);
router.post("/:id/validate", validateTDSSimulation);

// Certificate and challan generation routes
router.post("/:id/generate-certificate", generateTDSCertificate);
router.post("/:id/generate-challan", generateTDSChallan);

module.exports = router;
