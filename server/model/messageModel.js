const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    content: {
      type: String,
    },
    attachment: {
      type: String,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    }
  },
  { timestamps: true, }
);

module.exports = mongoose.model("Messages", MessageSchema);