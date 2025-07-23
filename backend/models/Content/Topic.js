import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  contents: [{ type: String }], // base64 encoded content
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
});

const Topic = mongoose.model("Topic", topicSchema);
export default Topic;
