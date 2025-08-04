import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  adminReply: { type: String, default: null },
  adminRepliedAt: { type: Date, default: null },
  adminRepliedBy: { type: String, default: null },
  status: { type: String, enum: ["pending", "replied"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

const Message =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);
export default Message;
