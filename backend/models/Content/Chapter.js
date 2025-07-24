import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ChapterSchema = new Schema({
  title: { type: String, required: true },
  topics: [{ type: Schema.Types.ObjectId, ref: "Topic" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Chapter = model("Chapter", ChapterSchema);
export default Chapter;
