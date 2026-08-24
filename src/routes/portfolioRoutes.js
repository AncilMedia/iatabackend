const express = require("express");

const {
  createPortfolio,
  getPortfolios,
  getPortfolio,
  updatePortfolio,
  deletePortfolio,
} = require("../controllers/portfolioController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Public
router.get("/", getPortfolios);

router.get("/:id", getPortfolio);

// Admin
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  createPortfolio
);

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updatePortfolio
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deletePortfolio
);

module.exports = router;