const router = require("express").Router();
const Message = require("../Controllers/messageController");

router.post("/message", Message.sendMessage);
router.get("/chat/conversation/:conversationId", Message.getMessages);

module.exports = router;
