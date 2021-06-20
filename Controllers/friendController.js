const mongoose = require("mongoose");
const User = require("../Model/userSchema");
const Conversation = require("../Model/conversationSchema");

/************************************************************/

const getFriend = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $in: [req.params.uid] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

/***********************************************************/
const addfriend = async (req, res, next) => {
  const friendID = req.body.friendID;
  const uid = req.body.uid;

  if (!friendID || !uid) {
    res.status(404).json({
      message: "field can't be empty",
      status: false,
    });
    return;
  }
  if (friendID == uid) {
    res.status(404).json({
      message: "you can't be in your friendList",
      status: false,
    });
    return;
  }
  const admin = await User.findOne({
    _id: mongoose.Types.ObjectId(uid),
  });
  const friend = await User.findOne({
    _id: mongoose.Types.ObjectId(friendID),
  });

  const newConversation = new Conversation({
    members: [req.body.uid, req.body.friendID],
  });

  const adminInstance = {
    uid: uid,
    name: admin.name,
    userName: admin.credentials.userName,
    conversationId: newConversation._id,
  };
  const newFriend = {
    uid: friendID,
    name: friend.name,
    userName: friend.credentials.userName,
    conversationId: newConversation._id,
  };

  const isAlreadyfriend = admin.friends.findIndex((friend) => {
    return friend.uid == friendID;
  });
  if (
    admin.friends.length == 0 ||
    (isAlreadyfriend == -1 && admin.uid != friendID)
  ) {
    admin.friends.push(newFriend);
    friend.friends.push(adminInstance);
    admin
      .save()
      .then(() => {
        friend.save().then(() => {
          newConversation.save().then(() => {
            res.status(200).json({
              message: "friend added!! && Coversation created",
              friends: admin.friends,
              newFriend: newFriend,
              conversations: newConversation,
              status: true,
            });
          });
        });
      })
      .catch(() => {
        res.status(502).json({
          message: "Something went wrong!!!!!!!",
          status: false,
        });
      });
  } else {
    return res.status(422).json({
      message: `${friend.name}` + " is already in your friendList",
      status: false,
    });
  }
};

/************************************************************/

exports.addfriend = addfriend;
exports.getFriend = getFriend;
