const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    prompt: {
      type: String,
      required: true,
      trim: true,
    },
    response: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      default: "google/gemma-3-4b-it:free",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("Conversation", conversationSchema);
