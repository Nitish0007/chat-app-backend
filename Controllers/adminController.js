const User = require("../Model/userSchema");

/*****************************************************************/

const signup = async (req, res, next) => {
  const name = req.body.name;
  const username = req.body.userName;
  const password = req.body.password;
  if (!name || !username || !password) {
    res.status(404).json({ message: "fields can't be empty" });
    return;
  }

  const result = await User.findOne({
    "credentials.name": name,
    "credentials.userName": username,
    "credentials.password": password,
  });

  const checkUser = await User.findOne({
    "credentials.userName": username,
  });

  if (checkUser) {
    return res
      .status(404)
      .json({ message: "UserName is already taken", status: false });
  }

  if (!result) {
    const newUser = new User({
      name: name,
      friends: [],
      credentials: {
        name: name,
        userName: username,
        password: password,
      },
    });
    newUser
      .save()
      .then(() =>
        res.status(200).json({
          message: "Successfully signed Up!!",
          status: true,
        })
      )
      .catch(() =>
        res.status(502).json({
          message: "Something went wrong",
        })
      );
  }
};

/********************************************************************/

const login = async (req, res, next) => {
  const username = req.body.userName;
  const password = req.body.password;
  if (!username || !password) {
    res.status(404).json({
      message: "fields can't be empty",
      status: false,
    });
    return;
  }
  const result = await User.findOne({
    "credentials.userName": username,
    "credentials.password": password,
  });
  if (!result) {
    res.status(404).json({ message: "Invalid Credentials!!!", status: false });
    return;
  }
  res.status(200).json({
    messsage: "LoggedIN",
    auth: true,
    user: {
      username: username,
      name: result.name,
      uid: result._id,
      friends: result.friends,
      messages: result.messages,
    },
    status: true,
  });
};

/*********************************************************************/

exports.signup = signup;
exports.login = login;
