const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
SECRET_FOR_ENCR = process.env.SECRET_FOR_ENCR;

const registerUser = async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: "pass or username is not here" });
  }

  try {
    const hashedPass = await bcrypt.hash(req.body.password, 10);

    const userToSend = new User({
      username: req.body.username,
      password: hashedPass,
    });

    await userToSend.save();
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "server error (*username taken)" });
  }

  return res.status(200).json({ message: "success" });
};

const login = async (req, res) => {
  let token;
  try {
    const userdb = await User.findOne({ username: req.body.username });
    if (!userdb) {
      return res.status(400).json({ message: "no such user" });
    }
    const isPassvalid = await bcrypt.compare(
      req.body.password,
      userdb.password
    );
    if (!isPassvalid) {
      return res.status(400).json({ message: "passport is wrong" });
    }
    token = jwt.sign(
      { username: userdb.username, _id: userdb._id },
      SECRET_FOR_ENCR,
      { expiresIn: 24000 }
    );
  } catch (e) {
    return res.status(500).json({ message: "server error", e });
  }
  return res.status(200).json({ message: "success", jwt_token: token });
};

module.exports = { registerUser, login };
