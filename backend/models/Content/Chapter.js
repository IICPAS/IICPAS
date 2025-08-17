import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ChapterSchema = new Schema({
  title: { type: String, required: true },
  topics: [{ type: Schema.Types.ObjectId, ref: "Topic" }],
  subchapters: [{ type: Schema.Types.ObjectId, ref: "SubChapter" }], // Add sub-chapters
  order: { type: Number, default: 0 }, // For ordering chapters
  status: { type: String, default: "active", enum: ["active", "inactive"] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Chapter = model("Chapter", ChapterSchema);
export default Chapter;
