const mongoose = require("mongoose");
const chapterSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const storySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    synopsis: String,
    writer: String,
    category: String,
    tags: [String],
    coverImage: String,
    status: { type: String, enum: ["Publish", "Draft"], default: "Draft" },
    chapters: [chapterSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Story", storySchema);
