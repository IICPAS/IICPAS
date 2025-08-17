import mongoose from "mongoose";
const { Schema, model } = mongoose;

const SubChapterSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }, // HTML content for rich text
  order: { type: Number, default: 0 }, // For ordering sub-chapters
  status: { type: String, default: "active", enum: ["active", "inactive"] },
  chapter: { type: Schema.Types.ObjectId, ref: "Chapter", required: true },
  topics: [{ type: Schema.Types.ObjectId, ref: "Topic" }], // Topics within this sub-chapter
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const SubChapter = model("SubChapter", SubChapterSchema);
export default SubChapter;
