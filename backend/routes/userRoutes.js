const express = require("express");
const router = express.Router();
const { createUser, getAllUsers } = require("../controllers/userControllers");
const authMiddleware = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorize");


router.post(
  "/",
  authMiddleware,
  authorize("super-admin"),
  createUser
);

router.get(
  "/",
  authMiddleware,
  authorize("super-admin"),
  getAllUsers
);



module.exports = router;