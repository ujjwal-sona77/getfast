const userModel = require("../models/userModel");

module.exports.RemoveProductFromCart = async (req, res) => {
  const user = await userModel.findOne({ email: req.params.email });
  // Find index of first matching product ID
  const index = user.cart.findIndex(
    (id) => id.toString() === req.params.productid
  );
  if (index !== -1) {
    // Remove only one instance of the product
    user.cart.splice(index);
    await user.save();
  }
  res.status(200).send({ message: "Product removed from cart", success: true });
};

module.exports.DecreaseQuantityOfProduct = async (req, res) => {
  const user = await userModel.findOne({ email: req.params.email });
  // Find index of first matching product ID
  const index = user.cart.findIndex(
    (id) => id.toString() === req.params.productid
  );
  if (index !== -1) {
    // Remove only one instance of the product
    user.cart.splice(index, 1);
    await user.save();
  }
  res.status(200).send({ message: "Product removed from cart", success: true });
};

module.exports.IncreaseProductQuantity = async (req, res) => {
  const user = await userModel.findOne({ email: req.params.email });
  user.cart.push(req.params.productid);
  await user.save();
  res.status(200).send({ message: "Product added to cart", success: true });
};
