const mongoose = require("mongoose");

//creating new model in database for messages
const MessageSchema = mongoose.Schema(
  {
    content: {
      type: String, 
      required: true ,
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
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Messages", MessageSchema);