const Lead = require("../models/Lead");

const createLead = async (req, res, next) => {
  try {
    const {
      fullName,
      phone,
      email,
      source,
      budget,
    } = req.body;

    const lead = await Lead.create({
      fullName,
      phone,
      email,
      source,
      budget,
    });

    res.status(201).json({
      message: "Lead created successfully",
      lead,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLead,
};