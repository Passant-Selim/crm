const User = require("../models/User");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/AppError");

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return next(
        new AppError(
          "All fields are required",
          400
        )
      );
    }

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return next(
        new AppError(
          "Email already exists",
          400
        )
      );
    }

    if (role === "super-admin") {
      return next(
        new AppError(
          "Cannot create super admin",
          403
        )
      );
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message:
        "User created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password");

    res.status(200).json({
      count: users.length,
      users,
    });

  } catch (error) {
    next(error);
  }
};


module.exports = {
  createUser,
  getAllUsers
}