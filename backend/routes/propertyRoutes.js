const express = require("express");
const router = express.Router();
const {
  createProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorize");

const upload = require("../middlewares/uploadMiddleware");

router.get(
  "/",
  authMiddleware,
  authorize("super-admin", "team-leader", "agent", "data-entry"),
  getProperties,
);
router.get(
  "/:id",
  authMiddleware,
  authorize("super-admin", "team-leader", "agent", "data-entry"),
  getProperty,
);

router.post(
  "/",
  authMiddleware,
  authorize("super-admin", "data-entry"),
  upload.single("mainImage"),
  createProperty,
);

router.patch(
  "/:id", 
  authMiddleware, 
  authorize("super-admin", "data-entry"), 
  upload.single("mainImage"), 
  updateProperty
);

router.delete(
  "/:id", 
  authMiddleware, 
  authorize("super-admin", "data-entry"), 
  deleteProperty
);

module.exports = router;
