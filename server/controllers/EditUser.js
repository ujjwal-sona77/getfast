const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const upload = require("../config/multer");

(module.exports.EditUser = upload.single("picture")),
  async (req, res) => {
    try {
        const user = await userModel.findOneAndUpdate({ email: req.params.email }, { new: true });
        if (req.file) {
            user.picture = req.file.buffer;
        }
        if (req.body.fullname && req.body.fullname.trim() !== "") {
            user.fullname = req.body.fullname;
        }
        if (req.body.email && req.body.email.trim() !== "") {
            user.email = req.body.email;
        }
        await user.save();
        let token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
        res.cookie("token", token);
      res
        .status(200)
        .send({ message: "Profile updated successfully", success: true });
    } catch (err) {
      res.status(500).send({ message: err.message, success: false });
    }
    return;
  };
