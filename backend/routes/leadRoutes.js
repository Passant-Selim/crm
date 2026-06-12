const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authmiddleware");
const authorize = require("../middlewares/authorize");

const {
  createLead,
} = require("../controllers/leadController");

router.post(
  "/",
  authMiddleware,
  authorize(
    "data-entry"
  ),
  createLead
);

module.exports = router;