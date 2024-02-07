const UserModel = require("../models/UserModel");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const postUser = async (req, res) => {
  const { username } = req.body;
  const getuser = await UserModel.find({ username: username });
  const dupuser = getuser.map((user) => user.username);
  if (dupuser.length > 0) {
    res.status(201).json({ message: "alreadyexits" });
  } else {
    bcrypt.genSalt(5, (err, salt) => {
      bcrypt.hash(req.body.password, salt, (err, hashedpassword) => {
        const password = hashedpassword;
        try {
          const createUser = UserModel.create({
            username: username,
            password: password,
          });
          if(createUser){
            return res.status(201).json({ message: "accountcreated" });
          }else{
            return res.status(404).json({ message: "failed" });
          }
        } catch (err) {
          res.status(404).json({ message: err });
        }
      });
    });
  }
};

const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const users = await UserModel.find({ username: username });

  if (users.length > 0) {
    const hashedPassword = users[0].password;

    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if (passwordMatch) {
      const accessToken = jwt.sign(
        { id: users[0]._id, username: users[0].username },
        process.env.ACCESS_TOKEN,
        { expiresIn: "1d" }
      );
      res.status(200).json({ message: "success", token: accessToken });
    } else {
      res.status(200).json({ message: "wrongpass" });
    }
  } else {
    res.status(200).json({ message: "usernotexists" });
  }
};

module.exports = { postUser, postLogin };
