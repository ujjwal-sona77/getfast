const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
dotenv.config();
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
        res.cookie("token", token, { httpOnly: true });
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

app.post("/api/owner/createproduct", upload.single("image"), async (req, res) => {
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
});

app.get("/api/owner/allproducts", async (req, res) => {
  const products = await productModel.find();
  res.status(200).send({ products, success: true });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
