const express = require("express");
const router = express.Router();
const { getAgents, getAgent, updateAgent, removeAgentFromTeam } = require("../controllers/agentController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorize");


router.get(
    "/",
    authMiddleware,
    authorize("super-admin", "team-leader"),
    getAgents
);

router.get(
    "/:id",
    authMiddleware,
    authorize("super-admin", "team-leader"),
    getAgent
);

router.patch(
    "/:id",
    authMiddleware,
    authorize("super-admin"),
    updateAgent
);

router.delete(
    "/:id",
    authMiddleware,
    authorize("super-admin"),
    removeAgentFromTeam
);

module.exports = router;