const mongoose = require("mongoose");

const User = new mongoose.Schema({
  name: { type: String, required: true },
  auth: { type: Boolean },
  friends: [
    {
      uid: { type: String },
      name: { type: String },
      userName: { type: String },
      chatroom: { type: String },
      conversationId: { type: String },
    },
  ],
  chatrooms: [
    {
      crID: { type: String },
      // messages: [
      //   {
      //     messsage: {
      //       mid: { type: String },
      //       text: { type: String },
      //       time: { type: String },
      //     },
      //   },
      // ],
    },
  ],
  credentials: {
    name: { type: String, required: true },
    userName: { type: String, required: true },
    password: { type: String, required: true },
  },
});

module.exports = mongoose.model("User", User);
