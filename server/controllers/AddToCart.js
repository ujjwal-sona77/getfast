module.exports.AddToCart = async (req, res) => {
  const productId = req.params.productId;
  const user = await userModel.findOne({ email: req.params.user });
  user.cart.push(productId);
  await user.save();
  res.status(200).send({ message: "Product added to cart", success: true });
};
