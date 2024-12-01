const express = require("express");
const app = express.Router();
const { UserSignup, LoginUser, Logout } = require("./controllers/Auth");
const { AddToCart } = require("../controllers/AddToCart");
const { EditUser } = require("../controllers/EditUser");
const { CreateProduct } = require("../controllers/CreateProduct");
const { GetProfile } = require("../controllers/GetProfile");
const { CreateOrder } = require("../controllers/CreateOrder");
const {
  RemoveProductFromCart,
  DecreaseQuantityOfProduct,
  IncreaseProductQuantity,
} = require("../controllers/CartControls");
const { GetAllProducts } = require("../utils/GetAllProducts");

app.post("/auth/signup", UserSignup);

app.post("/auth/login", LoginUser);

app.post("/cart/add/:productId/:user", AddToCart);

app.get("/auth/logout", Logout);

app.post("/owner/createproduct", CreateProduct);

app.get("/owner/allproducts/", GetAllProducts);
app.get("/user/profile/:email", GetProfile);

app.post("/cart/increase/:productid/:email", IncreaseProductQuantity);

app.post("/cart/decrease/:productid/:email", DecreaseQuantityOfProduct);

app.post("/cart/remove/:productid/:email", RemoveProductFromCart);
app.post("/user/editprofile/:email", EditUser);

app.post("/api/orders/create/:email", CreateOrder);
