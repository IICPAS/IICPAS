import express from "express";
import {
  addIP,
  getAllIPs,
  getIPById,
  updateIP,
  deleteIP,
  checkIPWhitelist,
} from "../controllers/ipWhitelistController.js";

const router = express.Router();

// CREATE - Add new IP to whitelist
router.post("/", addIP);

// READ - Get all whitelisted IPs
router.get("/", getAllIPs);

// READ - Get single IP by ID
router.get("/:id", getIPById);

// UPDATE - Update IP details
router.put("/:id", updateIP);

// DELETE - Remove IP from whitelist
router.delete("/:id", deleteIP);

// Check if specific IP is whitelisted
router.get("/check/:ipAddress", checkIPWhitelist);

export default router;
