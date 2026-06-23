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
    const users = await User.find({ isActive: true })
      .select("-password");

    res.status(200).json({
      count: users.length,
      users,
    });

  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById({ _id: req.params.id, isActive: true }).select(
      "name email role createdAt",
    );

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, email, role, isActive } = req.body;

    if (!name && !email && !role) {
      return next(new AppError("Please provide data to update", 400));
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    if (user.role === "super-admin") {
      return next(new AppError("Cannot update super admin", 403));
    }

    if (role === "super-admin") {
      return next(new AppError("Cannot assign super admin role", 403));
    }

    if (email) {
      const existingUser = await User.findOne({ email });

      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return next(new AppError("Email already exists", 400));
      }
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    if (user.role === "super-admin") {
      return next(new AppError("Cannot delete super admin", 403));
    }

    if (!user.isActive) {
      return next(new AppError("User already inactive", 400));
    }

    user.isActive = false;

    await user.save();

    res.status(200).json({
      message: "User deactivated successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
}