import express from "express";
import {
  createBooking,
  getAllBookings,
  approveAndBook,
  rejectBooking,
} from "../controllers/Bookings/bookingsController.js";

const router = express.Router();

// User: create a booking (pending)
router.post("/", createBooking);

// List all bookings (optionally filter by status)
router.get("/", getAllBookings);

// Admin: approve a booking (auto-assign slot)
router.patch("/:id/approve", approveAndBook);

// Admin: reject/cancel booking (optional)
router.patch("/:id/reject", rejectBooking);

export default router;
