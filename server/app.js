const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();

const cors = require("cors");
const cookieParser = require("cookie-parser");

const ApiRoutes = require("./routes/api.route");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", ApiRoutes);

// app.use(express.static("dist"));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});
