import express from "express";
import {
  createMessage,
  getMessages,
  getMessage,
  updateMessage,
  deleteMessage,
} from "../controllers/messageControllers.js";

const router = express.Router();

// Create a message
router.post("/", createMessage);

// Get all messages
router.get("/", getMessages);

// Get a single message by ID
router.get("/:id", getMessage);

// Update a message by ID
router.put("/:id", updateMessage);

// Delete a message by ID
router.delete("/:id", deleteMessage);

export default router;
