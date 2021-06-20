const Message = require("../Model/MessageSchema");

const sendMessage = async (req, res) => {
  const newMessage = new Message({ ...req.body, timestamp: Date.now() });
  try {
    const message = await newMessage.save();
    res.status(200).json({ message });
  } catch (err) {
    res.status(500).json(err);
  }
};

const getMessages = async (req, res) => {
  try {
    const oldMessages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(oldMessages);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { sendMessage, getMessages };
