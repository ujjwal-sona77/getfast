const userModel = require("../models/userModel")



module.exports.GetProfile = async (req, res) => {
  try {
    const user = await userModel
      .findOne({ email: req.params.email })
      .populate("cart");
    res.status(200).send({ user, success: true });
  } catch (err) {
    res.status(500).send({ message: err.message, success: false });
  }
};
