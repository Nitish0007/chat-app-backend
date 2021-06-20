const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("conversation", conversationSchema);
