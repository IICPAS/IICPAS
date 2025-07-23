import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subchapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subchapter" }],
});

const Chapter = mongoose.model("Chapter", chapterSchema);
export default Chapter;
