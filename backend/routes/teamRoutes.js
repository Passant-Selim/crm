const express = require("express");
const router = express.Router();
const { createTeam, getTeams, updateTeam, deleteTeam, getTeam } = require("../controllers/teamController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorize");

router.post(
  "/",
  authMiddleware,
  authorize("super-admin"),
  createTeam
);

router.get(
  "/",
  authMiddleware,
  authorize("super-admin", "team-leader", "agent", "data-entry"),
    getTeams
);

router.patch(
  "/:id",
  authMiddleware,
  authorize("super-admin"), 
  updateTeam
);

router.delete(
  "/:id",
  authMiddleware,
  authorize("super-admin"), 
  deleteTeam
);

router.get(
  "/:id",
  authMiddleware,
  authorize("super-admin"), 
  getTeam
);

module.exports = router;