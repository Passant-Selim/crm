const Team = require("../models/Team");  
const User = require("../models/User");     
const AppError = require("../utils/AppError");          

const createTeam = async (req, res, next) => {
  try {
    const { name, leader, agents, dataEntries } = req.body;

    if (!name || !leader) {
      return next(new AppError("Team name and leader are required", 400));
    }

    const existingTeam = await Team.findOne({ name });
    if (existingTeam) {
      return next(new AppError("Team name already exists", 400));
    }

    const teamLeader = await User.findById(leader);
    if (!teamLeader) {
      return next(new AppError("Leader not found", 404));
    }
    if (teamLeader.role !== "team-leader") {
      return next(new AppError("Selected user is not a team leader", 400));
    }
    if (teamLeader.team) {
      return next(new AppError("Leader already belongs to a team", 400));
    }

    if (agents?.length) {
      const agentUsers = await User.find({
        _id: { $in: agents },
      });

      if (agentUsers.length !== agents.length) {
        return next(new AppError("One or more assigned agents do not exist", 404));
      }

      for (const agent of agentUsers) {
        if (agent.role !== "agent") {
          return next(new AppError(`${agent.name} is not an agent`, 400));
        }

        if (agent.team) {
          return next(
            new AppError(`${agent.name} already belongs to a team`, 400),
          );
        }
      }
    }

    if (dataEntries?.length) {
      const entries = await User.find({
        _id: {
          $in: dataEntries,
        },
      });

      if (entries.length !== dataEntries.length) {
        return next(new AppError("One or more assigned data entries do not exist", 404));
      }

      for (const entry of entries) {
        if (entry.role !== "data-entry") {
          return next(new AppError(`${entry.name} is not a data entry`, 400));
        }

        if (entry.team) {
          return next(
            new AppError(`${entry.name} already belongs to a team`, 400),
          );
        }
      }
    }

    const team = await Team.create({
      name,
      leader,
      agents,
      dataEntries,
      createdBy: req.user.id,
    });

    // Update leader
    teamLeader.team = team._id;

    await teamLeader.save();

    // Update agents
    if (agents?.length) {
      await User.updateMany(
        {
          _id: { $in: agents },
        },
        {
          team: team._id,
        },
      );
    }

    // Update data entries
    if (dataEntries?.length) {
      await User.updateMany(
        {
          _id: {
            $in: dataEntries,
          },
        },
        {
          team: team._id,
        },
      );
    }

    res.status(201).json({
      message: "Team created successfully",
      team,
    });
  } catch (error) {
    next(error);
  }
};

const getTeams = async (req, res, next) => {
  try {
    let query = {};
    const userRole = req.user.role;
    const userId = req.user.id;

    if (userRole === "team-leader") {
      query = { leader: userId };
    } 
    else if (userRole === "agent") {
      query = { agents: userId };
    } 
    else if (userRole === "data-entry") {
      query = { dataEntries: userId };
    }
    
    const teams = await Team.find(query)
      .populate({
        path: "leader",
        select: "name email role isActive",
      })
      .populate({
        path: "agents",
        select: "name email role isActive",
      })
      .populate({
        path: "dataEntries",
        select: "name email role isActive",
      });

    res.status(200).json({
      status: "success",
      results: teams.length,
      teams,
    });
  } catch (error) {
    next(error); 
  }
};

const updateTeam = async (req, res, next) => {
  try {
    const teamId = req.params.id;
    const { name, leader, agents, dataEntries } = req.body;

    const team = await Team.findById(teamId);
    if (!team) {
      return next(new AppError("Team not found", 404));
    }

    if (name && name !== team.name) {
      const existingTeam = await Team.findOne({ name });
      if (existingTeam) {
        return next(new AppError("Team name already exists", 400));
      }
      team.name = name;
    }

    if (leader && leader !== team.leader.toString()) {
      const newLeader = await User.findById(leader);
      if (!newLeader || newLeader.role !== "team-leader") {
        return next(new AppError("Selected user is not a valid team leader", 400));
      }
      if (newLeader.team && newLeader.team.toString() !== teamId) {
        return next(new AppError("This leader already belongs to another team", 400));
      }

      await User.findByIdAndUpdate(team.leader, { team: null });
      
      team.leader = leader;
      newLeader.team = teamId;
      await newLeader.save();
    }


    if (agents) {
      await User.updateMany({ team: teamId, role: "agent" }, { team: null });

      if (agents.length > 0) {
        const validAgents = await User.find({ _id: { $in: agents }, role: "agent" });
        if (validAgents.length !== agents.length) {
          return next(new AppError("One or more selected users are not valid agents", 400));
        }
        await User.updateMany({ _id: { $in: agents } }, { team: teamId });
      }
      team.agents = agents;
    }


    if (dataEntries) {
      await User.updateMany({ team: teamId, role: "data-entry" }, { team: null });

      if (dataEntries.length > 0) {
        const validEntries = await User.find({ id: { $in: dataEntries }, role: "data-entry" });
        if (validEntries.length !== dataEntries.length) {
          return next(new AppError("One or more selected users are not valid data entries", 400));
        }
        await User.updateMany({ id: { $in: dataEntries } }, { team: teamId });
      }
      team.dataEntries = dataEntries;
    }

    await team.save();

    res.status(200).json({
      status: "success",
      message: "Team updated successfully",
      team,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTeam = async (req, res, next) => {
  try {
    const teamId = req.params.id;

    const team = await Team.findById(teamId);
    if (!team) {
      return next(new AppError("Team not found", 404));
    }

    await User.updateMany(
      { team: teamId }, 
      { team: null }
    );

    await Team.findByIdAndDelete(teamId);

    res.status(200).json({
      status: "success",
      message: "Team deleted successfully and all members are now unassigned.",
    });
  } catch (error) {
    next(error);
  }
};

const getTeam = async (req, res, next) => {
  try {
    const teamId = req.params.id;

    const team = await Team.findById(teamId)
      .populate({
        path: "leader",
        select: "name email role isActive",
      })
      .populate({
        path: "agents",
        select: "name email role isActive",
      })
      .populate({
        path: "dataEntries",
        select: "name email role isActive",
      });

    if (!team) {
      return next(new AppError("Team not found", 404));
    }

    res.status(200).json({
      status: "success",
      team,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTeam,
  getTeams,
  updateTeam,
  deleteTeam,
  getTeam
};