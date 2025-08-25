import express from "express";
import {
  getAllKits,
  getKitsByCategory,
  getKitById,
  createKit,
  updateKit,
  deleteKit,
  toggleKitStatus,
  updateStock,
  getLowStockKits,
  getKitStats
} from "../controllers/kitController.js";

const router = express.Router();

// Get all kits
router.get("/", getAllKits);

// Get kits by category
router.get("/category/:category", getKitsByCategory);

// Get single kit
router.get("/:id", getKitById);

// Create new kit
router.post("/", createKit);

// Update kit
router.put("/:id", updateKit);

// Delete kit
router.delete("/:id", deleteKit);

// Toggle kit status
router.put("/:id/toggle-status", toggleKitStatus);

// Update stock quantities
router.put("/:id/stock", updateStock);

// Get low stock kits
router.get("/low-stock", getLowStockKits);

// Get kit statistics
router.get("/stats", getKitStats);

export default router;
