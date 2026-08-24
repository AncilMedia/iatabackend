const Settings = require("../models/Settings");

const getWebsiteStatus = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({
        websiteEnabled: true,
      });
    }

    res.json({
      success: true,
      data: {
        websiteEnabled: settings.websiteEnabled,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get website status",
    });
  }
};

const updateWebsiteStatus = async (req, res) => {
  try {
    const {
      websiteEnabled,
    } = req.body;

    if (typeof websiteEnabled !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "websiteEnabled must be true or false",
      });
    }

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({
        websiteEnabled,
      });
    } else {
      settings.websiteEnabled = websiteEnabled;

      await settings.save();
    }

    res.json({
      success: true,
      message: websiteEnabled
        ? "Website enabled"
        : "Website disabled",

      data: {
        websiteEnabled:
          settings.websiteEnabled,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update website status",
    });
  }
};

module.exports = {
  getWebsiteStatus,
  updateWebsiteStatus,
};