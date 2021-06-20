const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 5000;

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: "https://chatapp-b2a26.web.app/",
});

require("events").EventEmitter.defaultMaxListeners = 0;

const userRoute = require("./Routes/loginRoute");
const friendRoute = require("./Routes/friendChatRoute");
const messageRoute = require("./Routes/messages");
const Message = require("./Model/MessageSchema");
require("events").EventEmitter.defaultMaxListeners = 0;
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  next();
});

app.use(bodyParser.json());
app.use(userRoute);
app.use(friendRoute);
app.use(messageRoute);

mongoose
  .connect(
    "mongodb+srv://Nitish:sharmaji007@cluster0.keezl.mongodb.net/chatdata?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected", " on port " + `${PORT}`);
    server.listen(PORT);
  })
  .catch((err) => {
    console.error("Cannot connect.", err);
  });

let users = [];
let messages = [];

const getUser = (uid) => {
  const user = users.find((user) => user.userId === uid);
  return user;
};

const addUser = (userId, socketId) => {
  const user = {
    userId: userId,
    socketId: socketId,
  };
  users.push(user);
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("addUser", (uid) => {
    addUser(uid, socket.id);
  });

  socket.on("sendMessage", ({ recieverId, senderId, text, conversationId }) => {
    const user = getUser(recieverId);
    messages.push({
      conversationId: conversationId,
      senderId: senderId,
      text: text,
    });

    io.to(socket.id).emit("getMessage", {
      conversationId,
      senderId,
      text,
    });

    if (user !== undefined) {
      io.to(user.socketId).emit("getMessage", {
        conversationId,
        senderId,
        text,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("disconnection occuered");
    messages.forEach((message) => {
      const messagesTillNow = new Message({ message });
      messagesTillNow.save();
    });
    removeUser(socket.id);
    messages = [];
  });

  socket.on("user-logout", () => {
    messages.forEach((message) => {
      console.log(message);
      const messagesTillNow = new Message({
        conversationId: message.conversationId,
        senderId: message.senderId,
        text: message.text,
      });
      messagesTillNow.save();
    });
    removeUser(socket.id);
    messages = [];
  });
});
