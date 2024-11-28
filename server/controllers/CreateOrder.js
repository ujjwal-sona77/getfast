const userModel = require("../models/userModel");
const orderModel = require("../models/orderModel")


module.exports.CreateOrder = async (req, res) => {
  const user = await userModel.findOne({ email: req.params.email });
  const order = await orderModel.create({
    products: user.cart,
    user: user._id,
    address: req.body.address,
    contactno: req.body.contactno,
    paymentMethod: req.body.paymentMethod,
    fullname: req.body.fullname,
    city: req.body.city,
    postalcode: req.body.postalcode,
  });
  user.orders.push(order._id);
  user.cart = [];
  await user.save();
  res
    .status(200)
    .send({ message: "Order created successfully", success: true });
};
