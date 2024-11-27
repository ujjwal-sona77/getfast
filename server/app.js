const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
dotenv.config();
const orderModel = require("./models/orderModel");
const upload = require("./config/multer");
const productModel = require("./models/productModel");
const userModel = require("./models/userModel");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.post("/api/auth/signup", async (req, res) => {
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
});

app.post("/api/auth/login", async (req, res) => {
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
});

app.post("/api/cart/add/:productId/:user", async (req, res) => {
  const productId = req.params.productId;
  const user = await userModel.findOne({ email: req.params.user });
  user.cart.push(productId);
  await user.save();
  res.status(200).send({ message: "Product added to cart", success: true });
});

app.get("/api/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.send({ message: "Logout successful", success: true });
});

app.post(
  "/api/owner/createproduct",
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, price, discount } = req.body;
      const image = req.file.buffer;
      const product = await productModel.create({
        name,
        price,
        discount,
        image,
      });
      res
        .status(200)
        .send({ message: "Product created successfully", success: true });
    } catch (error) {
      res.status(500).send({ message: error.message, success: false });
    }
  }
);

app.get("/api/owner/allproducts/", async (req, res) => {
  const products = await productModel.find();
  res.status(200).send({ products, success: true });
});
app.get("/api/user/profile/:email", async (req, res) => {
  try {
    const user = await userModel
      .findOne({ email: req.params.email })
      .populate("cart");
    res.status(200).send({ user, success: true });
  } catch (err) {
    res.status(500).send({ message: err.message, success: false });
  }
});

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
app.post(
  "/api/user/editprofile/:email",
  upload.single("picture"),
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
  }

);

app.post("/api/orders/create/:email", async (req, res) => {
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
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
