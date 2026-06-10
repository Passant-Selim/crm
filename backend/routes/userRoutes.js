const express = require("express");
const router = express.Router();
const { createUser } = require("../controllers/userControllers");
const authMiddleware = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorize");


router.post(
  "/",
  authMiddleware,
  authorize("super-admin"),
  createUser
);

module.exports = router;