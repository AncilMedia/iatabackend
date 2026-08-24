const express = require("express");

const {
  createEnquiry,
  getEnquiries,
  getEnquiry,
  markAsRead,
  deleteEnquiry,
} = require("../controllers/enquiryController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public website form
router.post("/", createEnquiry);

// Admin
router.get(
  "/",
  protect,
  adminOnly,
  getEnquiries
);

router.get(
  "/:id",
  protect,
  adminOnly,
  getEnquiry
);

router.patch(
  "/:id/read",
  protect,
  adminOnly,
  markAsRead
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteEnquiry
);

module.exports = router;