import express from "express";
import {
  getAllGroupPricing,
  getGroupPricingById,
  createGroupPricing,
  updateGroupPricing,
  deleteGroupPricing,
  getGroupPricingByLevel,
  getCoursesByLevel,
} from "../controllers/groupPricingController.js";

const router = express.Router();

// GET /api/group-pricing - Get all group pricing configurations
router.get("/", getAllGroupPricing);

// GET /api/group-pricing/:id - Get group pricing by ID
router.get("/:id", getGroupPricingById);

// POST /api/group-pricing - Create new group pricing configuration
router.post("/", createGroupPricing);

// PUT /api/group-pricing/:id - Update group pricing configuration
router.put("/:id", updateGroupPricing);

// DELETE /api/group-pricing/:id - Delete group pricing configuration
router.delete("/:id", deleteGroupPricing);

// GET /api/group-pricing/level/:level - Get group pricing by level
router.get("/level/:level", getGroupPricingByLevel);

// GET /api/group-pricing/courses/:level - Get available courses for a specific level
router.get("/courses/:level", getCoursesByLevel);

export default router;
