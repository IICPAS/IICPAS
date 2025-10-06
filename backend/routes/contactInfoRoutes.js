import express from "express";
import {
  getAllContactInfo,
  getActiveContactInfo,
  getContactInfoById,
  createContactInfo,
  updateContactInfo,
  toggleContactInfoStatus,
  deleteContactInfo,
  updateContactInfoOrder,
} from "../controllers/contactInfoController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

// Public routes (no authentication required)
router.get("/active", getActiveContactInfo);

// Admin routes (require authentication and admin role)
router.use(requireAuth);
router.use(isAdmin);

// CRUD operations
router.get("/all", getAllContactInfo);
router.get("/:id", getContactInfoById);
router.post("/", createContactInfo);
router.put("/:id", updateContactInfo);
router.put("/:id/toggle", toggleContactInfoStatus);
router.delete("/:id", deleteContactInfo);
router.put("/:id/order", updateContactInfoOrder);

export default router;
