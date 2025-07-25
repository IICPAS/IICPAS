import mongoose from "mongoose";

const metatagSchema = new mongoose.Schema({
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  keywords: { type: String, required: true },
});

const MetaTags = mongoose.model("Metatag", metatagSchema);
export default MetaTags;
