const express = require("express");
const router = express.Router();
const { createUser, getAllUsers, getUserById, updateUser, deleteUser } = require("../controllers/userControllers");
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

router.get(
  "/:id",
  authMiddleware,
  authorize("super-admin"),
  getUserById
);

router.patch(
  "/:id",
  authMiddleware,
  authorize("super-admin"),
  updateUser
);

router.delete(
  "/:id",
  authMiddleware,
  authorize("super-admin"),
  deleteUser
);

module.exports = router;