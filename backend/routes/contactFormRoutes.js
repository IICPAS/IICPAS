import express from "express";
import {
  getActiveContactForm,
  getAllContactForms,
  getContactFormById,
  createContactForm,
  updateContactForm,
  toggleContactFormStatus,
  deleteContactForm,
} from "../controllers/contactFormController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

// Public routes (no authentication required)
router.get("/active", getActiveContactForm);

// Admin routes (require authentication and admin role)
router.use(requireAuth);
router.use(isAdmin);

// CRUD operations
router.get("/all", getAllContactForms);
router.get("/:id", getContactFormById);
router.post("/", createContactForm);
router.put("/:id", updateContactForm);
router.put("/:id/toggle", toggleContactFormStatus);
router.delete("/:id", deleteContactForm);

export default router;
