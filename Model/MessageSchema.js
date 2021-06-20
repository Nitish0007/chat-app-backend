const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
  conversationId: { type: String },
  text: {
    type: String,
  },
  senderId: {
    type: String,
  },
  timeStamp: {
    type: Date,
  },
});

module.exports = mongoose.model("Message", MessageSchema);
