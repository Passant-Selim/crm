const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorize");
const {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
} = require("../controllers/leadController");


router.get(
  "/",
  authMiddleware,
  authorize("super-admin", "team-leader", "agent", "data-entry"),
  getLeads
);

router.get(
  "/:id",
  authMiddleware,
  authorize("super-admin", "team-leader", "agent", "data-entry"),
  getLead
);

router.post(
  "/",
  authMiddleware,
  authorize("super-admin", "data-entry"),
  createLead
);

router.patch(
  "/:id",
  authMiddleware,
  authorize("super-admin", "data-entry", "agent", "team-leader"),
  updateLead
);

router.delete(
  "/:id",
  authMiddleware,
  authorize("super-admin", "data-entry"),
  deleteLead
);

module.exports = router;