const Property = require("../models/Property");
const AppError = require("../utils/AppError");

const createProperty = async (req, res, next) => {
  try {
    console.log("create property");
    const imagePath = req.file ? req.file.path : req.body.mainImage;

    if (!imagePath) {
      return next(new AppError("Please upload a main image for the property", 400));
    }

    const propertyData = {
      ...req.body,
      mainImage: imagePath, 
      createdBy: req.user.id,
    };

    const newProperty = await Property.create(propertyData);

    res.status(201).json({
      status: "success",
      property: newProperty,
    });
  } catch (error) {
    next(error);
  }
};


const getProperties = async (req, res, next) => {
  try {
    const properties = await Property.find().populate({
      path: "createdBy",
      select: "name email role",
    });

    res.status(200).json({
      status: "success",
      results: properties.length,
      properties,
    });
  } catch (error) {
    next(error);
  }
};

const getProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate({
      path: "createdBy",
      select: "name email role",
    });

    if (!property) {
      return next(new AppError("Property not found", 404));
    }

    res.status(200).json({
      status: "success",
      property,
    });
  } catch (error) {
    next(error);
  }
};

const updateProperty = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.mainImage = req.file.path;
    }
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProperty) {
      return next(new AppError("Property not found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      property: updatedProperty,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);

    if (!property) {
      return next(new AppError("Property not found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  createProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty,
};