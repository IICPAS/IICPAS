import express from "express";
import {
  getAllSpecialOffers,
  getActiveSpecialOffers,
  getSpecialOfferById,
  createSpecialOffer,
  updateSpecialOffer,
  deleteSpecialOffer,
  toggleOfferStatus,
} from "../controllers/specialOfferController.js";

const router = express.Router();

// GET /api/special-offers - Get all special offers (with optional filters)
router.get("/", getAllSpecialOffers);

// GET /api/special-offers/active - Get active special offers for display
router.get("/active", getActiveSpecialOffers);

// GET /api/special-offers/:id - Get special offer by ID
router.get("/:id", getSpecialOfferById);

// POST /api/special-offers - Create new special offer
router.post("/", createSpecialOffer);

// PUT /api/special-offers/:id - Update special offer
router.put("/:id", updateSpecialOffer);

// DELETE /api/special-offers/:id - Delete special offer
router.delete("/:id", deleteSpecialOffer);

// PATCH /api/special-offers/:id/toggle - Toggle offer status
router.patch("/:id/toggle", toggleOfferStatus);

export default router;
