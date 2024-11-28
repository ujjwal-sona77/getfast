const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
dotenv.config();
const productModel = require("./models/productModel");
const userModel = require("./models/userModel");
const { UserSignup, LoginUser } = require("./controllers/Auth");
const { AddToCart } = require("./controllers/AddToCart");
const { EditUser } = require("./controllers/EditUser");
const { CreateProduct } = require("./controllers/CreateProduct");
const { GetProfile } = require("./controllers/GetProfile");
const { CreateOrder } = require("./controllers/CreateOrder");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.post("/api/auth/signup", UserSignup);

app.post("/api/auth/login", LoginUser);

app.post("/api/cart/add/:productId/:user", AddToCart);

app.get("/api/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.send({ message: "Logout successful", success: true });
});

app.post("/api/owner/createproduct", CreateProduct);

app.get("/api/owner/allproducts/", async (req, res) => {
  const products = await productModel.find();
  res.status(200).send({ products, success: true });
});
app.get("/api/user/profile/:email", GetProfile);

app.post("/api/cart/increase/:productid/:email", async (req, res) => {
  const user = await userModel.findOne({ email: req.params.email });
  user.cart.push(req.params.productid);
  await user.save();
  res.status(200).send({ message: "Product added to cart", success: true });
});

app.post("/api/cart/decrease/:productid/:email", async (req, res) => {
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
});

app.post("/api/cart/remove/:productid/:email", async (req, res) => {
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
});
app.post("/api/user/editprofile/:email", EditUser);

app.post("/api/orders/create/:email", CreateOrder);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
