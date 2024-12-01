const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
dotenv.config();
const ApiRoutes = require("./routes/api.route");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", ApiRoutes);

app.use(express.static("dist"));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});
