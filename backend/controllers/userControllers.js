const User = require("../models/User");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/AppError");

const createUser = async (req, res, next) => {
    try {
    const { name, email, password, role } = req.body;

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(
        new AppError("Email already exists", 400)
      );
    }

    if (role === "super-admin") {
      return next(new AppError("Cannot create super admin", 403));
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.status(201).json({
      message: "User created successfully",
      user: userResponse,
    })


    } catch (error) {
        next(error);
    }
}


module.exports = {
    createUser,
}