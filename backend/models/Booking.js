import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    by: { type: String, required: true }, // email of requester
    title: { type: String, required: true }, // purpose/title
    hrs: { type: Number, required: true }, // number of hours requested
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
      required: true,
    },
    category: {
      type: String,
      enum: ["recorded", "live", "onsite"],
      default: "onsite",
      required: true,
    },
    link: {
      type: String,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;
