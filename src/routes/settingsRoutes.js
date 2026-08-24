const express = require("express");

const {
  getWebsiteStatus,
  updateWebsiteStatus,
} = require("../controllers/settingsController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.get(
  "/website-status",
  getWebsiteStatus
);

// Admin
router.patch(
  "/website-status",
  protect,
  adminOnly,
  updateWebsiteStatus
);

module.exports = router;