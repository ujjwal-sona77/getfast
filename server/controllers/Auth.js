const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")



module.exports.UserSignup = async (req, res) => {
  try {
    const { email, password, fullname } = req.body;
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
          return res.send({ message: "User already exists" });
        }
        const user = await userModel.create({
          email,
          password: hash,
          fullname,
        });
        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET
        );
        res.cookie("token", token);
        res.send({ message: "User created successfully", success: true });
      });
    });
  } catch (error) {
    res.status(500).send({ message: error.message, success: false });
  }
};

module.exports.LoginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .send({ message: "Invalid username or password", success: false });
    } else {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          let token = jwt.sign({ email, id: user._id }, process.env.JWT_SECRET);
          res.cookie("token", token);
          res.status(200).json({ message: "Login successful", success: true });
        } else {
          return res.send({
            message: "Invalid username or password",
            success: false,
          });
        }
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
