const Enquiry = require("../models/Enquiry");
const {
  sendEnquiryEmail,
} = require("../config/mail");

const createEnquiry = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      email,
      message,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !phone ||
      !email ||
      !message
    ) {
      return res.status(400).json({
        success: false,
        message:
          "First name, last name, phone, email and message are required",
      });
    }

    const enquiry = await Enquiry.create({
      firstName,
      lastName,
      phone,
      email,
      message,
    });

    try {
      await sendEnquiryEmail({
        firstName,
        lastName,
        phone,
        email,
        message,
      });
    } catch (mailError) {
      console.error(
        "Email sending failed:",
        mailError.message
      );

      return res.status(201).json({
        success: true,
        message:
          "Enquiry received, but email notification could not be sent",
        data: enquiry,
      });
    }

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      data: enquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit enquiry",
      error: error.message,
    });
  }
};

const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load enquiries",
    });
  }
};

const getEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(
      req.params.id
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.json({
      success: true,
      data: enquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load enquiry",
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      {
        isRead: true,
      },
      {
        new: true,
      }
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.json({
      success: true,
      message: "Enquiry marked as read",
      data: enquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update enquiry",
    });
  }
};

const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(
      req.params.id
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete enquiry",
    });
  }
};

module.exports = {
  createEnquiry,
  getEnquiries,
  getEnquiry,
  markAsRead,
  deleteEnquiry,
};