const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken");
const upload = require("../config/multer");

(module.exports.EditUser = upload.single("picture")),
  async (req, res) => {
    try {
      const alerdy_user = await userModel.findOne({ email: req.body.email });
      const user = await userModel.findOneAndUpdate(
        { email: req.params.email },
        { new: true }
      );
      if (req.file) {
        user.picture = req.file.buffer;
      }
      if (req.body.fullname && req.body.fullname.trim() !== "") {
        user.fullname = req.body.fullname;
      }
      if (alerdy_user) {
        res.status(501).json({ message: "Email alerdy used" });
      } else if (!alerdy_user) {
        if (req.body.email && req.body.email.trim() !== "") {
          user.email = req.body.email;
        }
      }
      await user.save();
      let token = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET);
      res.cookie("token", token);
      res
        .status(200)
        .send({ message: "Profile updated successfully", success: true });
    } catch (err) {
      res.status(500).send({ message: err.message, success: false });
    }
    return;
  };
