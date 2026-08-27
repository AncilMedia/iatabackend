const Portfolio = require("../models/Portfolio");

const cloudinary = require("../config/cloudinary");


// ============================================================
// UPLOAD BUFFER TO CLOUDINARY
// ============================================================

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream =
      cloudinary.uploader.upload_stream(
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


// ============================================================
// CREATE PORTFOLIO
// ============================================================

const createPortfolio = async (req, res) => {
  try {
    console.log("=================================");
    console.log("CREATE PORTFOLIO");
    console.log("=================================");

    console.log("User:", req.user?._id);
    console.log("Body:", req.body);
    console.log("File:", req.file
      ? {
          fieldname: req.file.fieldname,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
        }
      : null
    );

    const {
      title,
      description,
    } = req.body;


    // ========================================================
    // VALIDATE TEXT
    // ========================================================

    // if (!title || !description) {
    //   return res.status(400).json({
    //     success: false,
    //     message:
    //       "Title and description are required",
    //   });
    // }


    // ========================================================
    // VALIDATE IMAGE
    // ========================================================

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }


    // ========================================================
    // UPLOAD TO CLOUDINARY
    // ========================================================

    console.log(
      "Uploading image to Cloudinary..."
    );

    const uploaded =
      await uploadToCloudinary(
        req.file.buffer
      );


    console.log(
      "Cloudinary upload successful:",
      uploaded.secure_url
    );


    // ========================================================
    // SAVE TO DATABASE
    // ========================================================

    const portfolio =
      await Portfolio.create({
        title:
          title.trim(),

        description:
          description.trim(),

        imageUrl:
          uploaded.secure_url,

        imagePublicId:
          uploaded.public_id,

        createdBy:
          req.user._id,
      });


    // ========================================================
    // RESPONSE
    // ========================================================

    return res.status(201).json({
      success: true,

      message:
        "Portfolio created successfully",

      data: portfolio,
    });

  } catch (error) {
    console.error(
      "CREATE PORTFOLIO ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to create portfolio",

      error:
        error.message,
    });
  }
};


// ============================================================
// GET ALL PORTFOLIOS
// ============================================================

const getPortfolios = async (
  req,
  res
) => {
  try {
    const portfolios =
      await Portfolio.find()
        .populate(
          "createdBy",
          "name email"
        )
        .sort({
          createdAt: -1,
        });


    return res.json({
      success: true,

      count:
        portfolios.length,

      data:
        portfolios,
    });

  } catch (error) {
    console.error(
      "GET PORTFOLIOS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to load portfolios",

      error:
        error.message,
    });
  }
};


// ============================================================
// GET SINGLE PORTFOLIO
// ============================================================

const getPortfolio = async (
  req,
  res
) => {
  try {
    const portfolio =
      await Portfolio.findById(
        req.params.id
      ).populate(
        "createdBy",
        "name email"
      );


    if (!portfolio) {
      return res.status(404).json({
        success: false,

        message:
          "Portfolio not found",
      });
    }


    return res.json({
      success: true,

      data:
        portfolio,
    });

  } catch (error) {
    console.error(
      "GET PORTFOLIO ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to load portfolio",

      error:
        error.message,
    });
  }
};


// ============================================================
// UPDATE PORTFOLIO
// ============================================================

const updatePortfolio = async (
  req,
  res
) => {
  try {
    const portfolio =
      await Portfolio.findById(
        req.params.id
      );


    if (!portfolio) {
      return res.status(404).json({
        success: false,

        message:
          "Portfolio not found",
      });
    }


    // ========================================================
    // UPDATE TITLE
    // ========================================================

    if (
      req.body.title !== undefined
    ) {
      portfolio.title =
        req.body.title.trim();
    }


    // ========================================================
    // UPDATE DESCRIPTION
    // ========================================================

    if (
      req.body.description !== undefined
    ) {
      portfolio.description =
        req.body.description.trim();
    }


    // ========================================================
    // UPDATE IMAGE
    // ========================================================

    if (req.file) {

      console.log(
        "New image received:",
        req.file.originalname
      );


      // Delete old Cloudinary image
      if (portfolio.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(
            portfolio.imagePublicId
          );

          console.log(
            "Old Cloudinary image deleted"
          );

        } catch (error) {
          console.error(
            "Old image deletion failed:",
            error.message
          );
        }
      }


      // Upload new image
      const uploaded =
        await uploadToCloudinary(
          req.file.buffer
        );


      portfolio.imageUrl =
        uploaded.secure_url;

      portfolio.imagePublicId =
        uploaded.public_id;
    }


    // ========================================================
    // SAVE
    // ========================================================

    await portfolio.save();


    return res.json({
      success: true,

      message:
        "Portfolio updated successfully",

      data:
        portfolio,
    });

  } catch (error) {
    console.error(
      "UPDATE PORTFOLIO ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to update portfolio",

      error:
        error.message,
    });
  }
};


// ============================================================
// DELETE PORTFOLIO
// ============================================================

const deletePortfolio = async (
  req,
  res
) => {
  try {
    const portfolio =
      await Portfolio.findById(
        req.params.id
      );


    if (!portfolio) {
      return res.status(404).json({
        success: false,

        message:
          "Portfolio not found",
      });
    }


    // ========================================================
    // DELETE CLOUDINARY IMAGE
    // ========================================================

    if (portfolio.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(
          portfolio.imagePublicId
        );

        console.log(
          "Cloudinary image deleted"
        );

      } catch (error) {
        console.error(
          "Cloudinary deletion failed:",
          error.message
        );
      }
    }


    // ========================================================
    // DELETE DATABASE RECORD
    // ========================================================

    await Portfolio.deleteOne({
      _id:
        portfolio._id,
    });


    return res.json({
      success: true,

      message:
        "Portfolio deleted successfully",
    });

  } catch (error) {
    console.error(
      "DELETE PORTFOLIO ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to delete portfolio",

      error:
        error.message,
    });
  }
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
  createPortfolio,
  getPortfolios,
  getPortfolio,
  updatePortfolio,
  deletePortfolio,
};