// routes/leadRoutes.js
import express from "express";
import { createLead, getLeads, updateLead, deleteLead } from "../controllers/leadController.js";

const router = express.Router();

router.post("/leads", createLead);
router.get("/leads", getLeads);
router.put("/leads/:id", updateLead);
router.delete("/leads/:id", deleteLead);

export default router;
