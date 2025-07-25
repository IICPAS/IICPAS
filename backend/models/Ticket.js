import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    resolve: { type: String }, // hash this in production!
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", TicketSchema);
export default Ticket;
