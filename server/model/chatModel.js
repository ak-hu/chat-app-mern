const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    isGroupChat: {
      type: Boolean,
      default: false
    },
    chatName: {
      type: String,
      trim: true
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Messages",
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    groupPic: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Chat", chatSchema);