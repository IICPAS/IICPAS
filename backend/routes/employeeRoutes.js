import express from "express";
import {
  registerEmployee,
  loginEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  updateEmployeePermissions,
  deleteEmployee,
  getEmployeeProfile,
  updatePassword,
} from "../controllers/employeeController.js";
import { requireAuth, requirePermission } from "../middleware/requireAuth.js";

const router = express.Router();

// Public routes
router.post("/login", loginEmployee);

// Protected routes
router.use(requireAuth);

// Employee management routes (Admin only)
router.post("/", requirePermission("staff", "add"), registerEmployee);
router.get("/", requirePermission("staff", "read"), getEmployees);
router.get("/profile", getEmployeeProfile);
router.put("/password", updatePassword);

// Individual employee routes
router.get("/:id", requirePermission("staff", "read"), getEmployeeById);
router.put("/:id", requirePermission("staff", "update"), updateEmployee);
router.put(
  "/:id/permissions",
  requirePermission("staff", "update"),
  updateEmployeePermissions
);
router.delete("/:id", requirePermission("staff", "delete"), deleteEmployee);

export default router;
