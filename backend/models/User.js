const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value) => value.length >= 7,
        message: "Username must be at least 7 characters",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: (value) =>
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value),
        message: "Please enter a valid email address",
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value) => value.length >= 6,
        message: "Password must be at least 6 characters",
      },
    },
    role: {
      type: String,
      enum: ["super-admin", "admin", "data-entry", "agent"],
      default: "agent",
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
