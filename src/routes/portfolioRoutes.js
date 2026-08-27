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

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
*/

// GET ALL
router.get(
  "/",
  getPortfolios
);

// GET SINGLE
router.get(
  "/:id",
  getPortfolio
);

/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/

// CREATE
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  createPortfolio
);

// UPDATE
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updatePortfolio
);

// DELETE
router.delete(
  "/:id",
  protect,
  adminOnly,
  deletePortfolio
);

module.exports = router;