import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    by: { type: String }, // email of requester
    title: { type: String }, // purpose/title
    hrs: { type: Number }, // number of hours requested
    start: { type: Date }, // when booking starts
    end: { type: Date }, // when booking ends
    date: { type: Date }, // the day being booked
    status: {
      type: String,
      enum: ["pending", "approved", "booked", "rejected"],
      default: "pending",
    },
    type: {
      type: String,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;
