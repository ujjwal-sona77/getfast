const productModel = require("../models/productModel");
const userModel = require("../models/userModel");

module.exports.GetAllProducts = async (req, res) => {
  const products = await productModel.find();
  res.status(200).send({ products, success: true });
};
