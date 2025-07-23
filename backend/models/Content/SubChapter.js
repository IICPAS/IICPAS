import mongoose from "mongoose";

const subchapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  topics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
});

const Subchapter = mongoose.model("Subchapter", subchapterSchema);
export default Subchapter;
