const User = require("../models/User");
const Team = require("../models/Team");
const AppError = require("../utils/AppError");

const getAgents = async (req, res, next) => {
  try {
    let queryFilter = { role: "agent" }; 

    if (req.user.role === "team-leader") {
      const myTeam = await Team.findOne({ leader: req.user.id });

      if (!myTeam || !myTeam.agents || myTeam.agents.length === 0) {
        return res.status(200).json({
          status: "success",
          results: 0,
          agents: [],
        });
      }

      queryFilter._id = { $in: myTeam.agents };
    }

    const agents = await User.find(queryFilter)
      .select("-password")
      .populate("team", "name");

    res.status(200).json({
      status: "success",
      results: agents.length,
      agents,
    });
  } catch (error) {
    next(error);
  }
};

const getAgent = async (req, res, next) => {
  try {
    let queryFilter = { _id: req.params.id, role: "agent" };

    if (req.user.role === "team-leader") {
      const myTeam = await Team.findOne({ leader: req.user.id });

      if (!myTeam || !myTeam.agents || !myTeam.agents.includes(req.params.id)) {
        return next(new AppError("Agent not found or you don't have permission to view them", 404));
      }
    }

    const agent = await User.findOne(queryFilter)
      .select("-password")
      .populate("team", "name");

    if (!agent) {
      return next(new AppError("Agent not found", 404));
    }

    res.status(200).json({
      status: "success",
      agent,
    });
  } catch (error) {
    next(error);
  }
};

const updateAgent = async (req, res, next) => {
  try {
    const checkAgent = await User.findOne({ _id: req.params.id, role: "agent" });
    if (!checkAgent) {
      return next(new AppError("Agent not found", 404));
    }

    if (req.body.team) {
      if (checkAgent.team) {
        await Team.findByIdAndUpdate(checkAgent.team, {
          $pull: { agents: checkAgent._id }, 
        });
      }

      await Team.findByIdAndUpdate(req.body.team, {
        $addToSet: { agents: checkAgent._id }, 
      });
    }

    const updatedAgent = await User.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after", 
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      status: "success",
      agent: updatedAgent,
    });
  } catch (error) {
    next(error);
  }
};

const removeAgentFromTeam = async (req, res, next) => {
  try {
    const agent = await User.findOne({ _id: req.params.id, role: "agent" });

    if (!agent) {
      return next(new AppError("Agent not found", 404));
    }

    if (!agent.team) {
      return next(new AppError("This agent is not assigned to any team already", 400));
    }

    const oldTeamId = agent.team;

    agent.team = null;
    await agent.save({ validateBeforeSave: false });

    await Team.findByIdAndUpdate(oldTeamId, {
      $pull: { agents: agent._id }
    });

    res.status(200).json({
      status: "success",
      message: "Agent has been removed from the team successfully",
      agent
    });
  } catch (error) {
    next(error);
  }
};




module.exports = {
  getAgents,
  getAgent,
  updateAgent,
  removeAgentFromTeam
};