const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, "Name must contain at least 3 characters"],
    required: [true, "Name is required"],
    maxlength: [30, "Name must not contain more than 30 characters!"],
  },

  email: {
    type: String,
    unique: true,
    match: [
      /^[A-Za-z0-9._]+@[A-Za-z]+\.[A-Za-z]{2,}$/,
      "Please provide a valid email address",
    ],
    required: [true, "Email is required"],
  },
  phone: {
    type: String,
    unique: true,
    match: [/^[0-9]{10}$/, "Please provide a valid phone number"],
    required: [true, "Phone is required"],
  },
  password: {
    type: String,
    select: false,
    required: [true, "Password is required"],
  },
  role: String,
});

const User = mongoose.model("users", userSchema);

module.exports = User;