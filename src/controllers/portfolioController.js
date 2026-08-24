const Portfolio = require("../models/Portfolio");
const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "website/portfolio",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    stream.end(buffer);
  });
};

const createPortfolio = async (req, res) => {
  try {
    const {
      title,
      description,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const uploaded = await uploadToCloudinary(
      req.file.buffer
    );

    const portfolio = await Portfolio.create({
      title,
      description,

      imageUrl: uploaded.secure_url,
      imagePublicId: uploaded.public_id,

      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Portfolio created successfully",
      data: portfolio,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create portfolio",
      error: error.message,
    });
  }
};

const getPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find()
      .populate("createdBy", "name email")
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      count: portfolios.length,
      data: portfolios,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load portfolios",
    });
  }
};

const getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(
      req.params.id
    ).populate("createdBy", "name email");

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    res.json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load portfolio",
    });
  }
};

const updatePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(
      req.params.id
    );

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    if (req.body.title !== undefined) {
      portfolio.title = req.body.title;
    }

    if (req.body.description !== undefined) {
      portfolio.description = req.body.description;
    }

    if (req.file) {
      if (portfolio.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(
            portfolio.imagePublicId
          );
        } catch (error) {
          console.error(
            "Old image deletion failed:",
            error.message
          );
        }
      }

      const uploaded = await uploadToCloudinary(
        req.file.buffer
      );

      portfolio.imageUrl = uploaded.secure_url;
      portfolio.imagePublicId = uploaded.public_id;
    }

    await portfolio.save();

    res.json({
      success: true,
      message: "Portfolio updated successfully",
      data: portfolio,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update portfolio",
      error: error.message,
    });
  }
};

const deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(
      req.params.id
    );

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    if (portfolio.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(
          portfolio.imagePublicId
        );
      } catch (error) {
        console.error(
          "Cloudinary deletion failed:",
          error.message
        );
      }
    }

    await Portfolio.deleteOne({
      _id: portfolio._id,
    });

    res.json({
      success: true,
      message: "Portfolio deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete portfolio",
      error: error.message,
    });
  }
};

module.exports = {
  createPortfolio,
  getPortfolios,
  getPortfolio,
  updatePortfolio,
  deletePortfolio,
};