const Lead = require("../models/Lead");
const User = require("../models/User");
const Team = require("../models/Team");
const AppError = require("../utils/AppError");

const createLead = async (req, res, next) => {
  try {
    if (req.user.role === "data-entry" && req.body.assignedTo) {
      return next(new AppError("Data entry employees are not allowed to assign leads to agents", 403));
    }

    if (req.body.assignedTo) {
      const agent = await User.findById(req.body.assignedTo);
      
      if (!agent) {
        return next(new AppError("Agent not found", 404));
      }

      if (!agent.team) {
        return next(new AppError("This agent is not assigned to any team yet. You cannot assign leads to them.", 400));
      }
    }

    const leadData = {
      ...req.body,
      createdBy: req.user.id, 
    };

    const newLead = await Lead.create(leadData);

    res.status(201).json({
      status: "success",
      lead: newLead,
    });
  } catch (error) {
    next(error);
  }
};

const getLeads = async (req, res, next) => {
  try {
    let queryFilter = {};

    if (req.user.role === "agent") {
      queryFilter = { assignedTo: req.user.id };
      
    } else if (req.user.role === "data-entry") {
      queryFilter = { createdBy: req.user.id };
      
    } else if (req.user.role === "team-leader") {
      const myTeam = await Team.findOne({ leader: req.user.id });

      if (!myTeam || !myTeam.dataEntries || myTeam.dataEntries.length === 0) {
        return res.status(200).json({
          status: "success",
          results: 0,
          leads: [],
        });
      }

      queryFilter = { createdBy: { $in: myTeam.dataEntries } };
    }

    const leads = await Lead.find(queryFilter)
      .populate({
        path: "interestedIn",
        select: "title price location type",
      })
      .populate({
        path: "assignedTo",
        select: "name email role",
      })
      .populate({
        path: "createdBy",
        select: "name role",
      });

    res.status(200).json({
      status: "success",
      results: leads.length,
      leads,
    });
  } catch (error) {
    next(error);
  }
};

const getLead = async (req, res, next) => {
  try {
    let queryFilter = { _id: req.params.id };

    if (req.user.role === "agent") {
      queryFilter.assignedTo = req.user.id;

    } else if (req.user.role === "data-entry") {
      queryFilter.createdBy = req.user.id;

    } else if (req.user.role === "team-leader") {
      const myTeam = await Team.findOne({ leader: req.user.id });

      if (!myTeam || !myTeam.dataEntries || myTeam.dataEntries.length === 0) {
        return next(new AppError("You do not have permission to view this lead, or your team is empty.", 403));
      }

      queryFilter.createdBy = { $in: myTeam.dataEntries };
    }
    

    const lead = await Lead.findOne(queryFilter)
      .populate({
        path: "interestedIn",
        select: "title price location type",
      })
      .populate({
        path: "assignedTo",
        select: "name email role",
      })
      .populate({
        path: "createdBy",
        select: "name role",
      });

    if (!lead) {
      return next(new AppError("Lead not found or you don't have permission to access it", 404));
    }

    res.status(200).json({
      status: "success",
      lead,
    });
  } catch (error) {
    next(error);
  }
};

const updateLead = async (req, res, next) => {
  try {
    let queryFilter = { _id: req.params.id };

    if (req.user.role === "data-entry") {
      queryFilter.createdBy = req.user.id;

      if (req.body.assignedTo) {
        return next(new AppError("Data entry employees are not allowed to change or assign agents", 403));
      }
    }

    if (req.user.role === "super-admin" && req.body.assignedTo) {
      const agent = await User.findById(req.body.assignedTo);
      
      if (!agent) {
        return next(new AppError("Agent not found", 404));
      }

      if (!agent.team) {
        return next(new AppError("This agent is not assigned to any team yet. You cannot assign leads to them.", 400));
      }
    }

    const updatedLead = await Lead.findOneAndUpdate(
      queryFilter, 
      req.body,
      {
        new: true,
        runValidators: true, 
      }
    );

    if (!updatedLead) {
      return next(new AppError("Lead not found or you don't have permission to modify it", 404));
    }

    res.status(200).json({
      status: "success",
      lead: updatedLead,
    });
  } catch (error) {
    next(error);
  }
};

const deleteLead = async (req, res, next) => {
  try {
    let queryFilter = { _id: req.params.id };

    if (req.user.role === "data-entry") {
      queryFilter.createdBy = req.user.id;
    }

    const lead = await Lead.findOneAndDelete(queryFilter);

    if (!lead) {
      return next(new AppError("Lead not found or you don't have permission to delete it", 404));
    }

    res.status(204).json({
      status: "success",
     message: "Lead has been deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
};