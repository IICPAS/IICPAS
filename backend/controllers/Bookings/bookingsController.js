// controllers/Bookings/bookingsController.js

import Booking from "../../models/Booking.js";

// PATCH /api/bookings/:id/reject
export const rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    // if (booking.status !== "pending") {
    //   return res
    //     .status(400)
    //     .json({ error: "Only pending bookings can be rejected" });
    // }

    booking.status = "rejected";
    await booking.save();

    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/bookings
export const createBooking = async (req, res) => {
  try {
    const { by, title, hrs, type } = req.body;
    if (!by || !title || !hrs)
      return res.status(400).json({ error: "All fields required" });
    const booking = new Booking({ by, title, hrs, type, status: "pending" });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const SLOT_START = 10; // 10am
const SLOT_END = 18; // 6pm

// Helper: Find next available slot using plain JS Date, starting from tomorrow (local)
async function findNextAvailableSlot(hrs) {
  let day = new Date();
  day.setHours(0, 0, 0, 0); // Local midnight today
  day.setDate(day.getDate() + 1); // Move to tomorrow

  while (true) {
    // Get year, month, date for this search day
    const year = day.getFullYear();
    const month = day.getMonth(); // Note: JS Date months are 0-based!
    const date = day.getDate();

    // Local 10:00 (start) and 18:00 (end)
    const dayStart = new Date(year, month, date, SLOT_START, 0, 0, 0);
    const dayEnd = new Date(year, month, date, SLOT_END, 0, 0, 0);

    // Get all booked slots on this day (between local 00:00 and 23:59:59)
    const bookings = await Booking.find({
      date: {
        $gte: new Date(year, month, date, 0, 0, 0, 0),
        $lte: new Date(year, month, date, 23, 59, 59, 999),
      },
      status: "booked",
    });

    // Build list of [start, end] intervals for the day
    let intervals = bookings.map((b) => [new Date(b.start), new Date(b.end)]);
    intervals.sort((a, b) => a[0] - b[0]); // Sort by start

    let current = new Date(dayStart);

    while (true) {
      let end = new Date(current.getTime() + hrs * 60 * 60 * 1000);
      if (end > dayEnd) break; // Out of working hours

      // Check for slot conflicts
      const conflict = intervals.some(
        ([bStart, bEnd]) => current < bEnd && end > bStart
      );
      if (!conflict) {
        // Found a free slot!
        return {
          start: new Date(current),
          end: new Date(end),
          date: new Date(dayStart),
        };
      }
      // Try next slot (30 mins later)
      current = new Date(current.getTime() + 30 * 60 * 1000);
    }
    // No slot found for this day, try next day
    day.setDate(day.getDate() + 1);
  }
}

// PATCH /api/bookings/:id/approve
export const approveAndBook = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Not found" });
    if (booking.status !== "pending")
      return res.status(400).json({ error: "Already processed" });

    // Find slot and assign (always starts from tomorrow)
    const slot = await findNextAvailableSlot(booking.hrs);
    if (!slot) return res.status(400).json({ error: "No slots available." });

    booking.start = slot.start;
    booking.end = slot.end;
    booking.date = slot.date;
    booking.status = "booked";
    await booking.save();
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/bookings or /api/bookings?status=booked&by=email
export const getAllBookings = async (req, res) => {
  try {
    const { status, by } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (by) filter.by = by;
    const bookings = await Booking.find(filter).sort({ start: 1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
