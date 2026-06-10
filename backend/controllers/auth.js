const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const generateToken = (id, role) => {
    return jwt.sign({
        id: id,
        role: role,
    }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return next(new AppError("Invalid email or password", 401));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new AppError("Invalid email or password", 401));
    }

    const token = generateToken(user._id, user.role);

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    res.status(200).json({
      token,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login };