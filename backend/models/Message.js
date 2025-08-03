import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    name: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: { createdAt: "created" } }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
