const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeaders = req.headers.authorization;

    if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
      return next(new AppError("Unauthorized", 401));
    }

    const token = authHeaders.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET, {algorithms: ["HS256"]});

    req.user = decodedToken;

    next();
  } catch (error) {
    return next(new AppError("Invalid or expired token. Please login again.", 401));
  }
};


module.exports =  authMiddleware ;