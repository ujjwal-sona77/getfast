const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URL).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
});

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        minLenght: 3
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    picture: Buffer,
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    }],
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    isAdmin: {
        type: Boolean,
        default: false
    }
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;