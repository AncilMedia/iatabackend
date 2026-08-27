const multer = require("multer");
const path = require("path");


// ============================================================
// STORAGE
// ============================================================

const storage = multer.memoryStorage();


// ============================================================
// EXTENSIONS
// ============================================================

const allowedExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".bmp",
];


// ============================================================
// MIME TYPES
// ============================================================

const allowedMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
  "application/octet-stream",
];


// ============================================================
// FILE FILTER
// ============================================================

const fileFilter = (req, file, cb) => {
  console.log("=================================");
  console.log("MULTER FILE");
  console.log("=================================");
  console.log(
    "Field:",
    file.fieldname
  );
  console.log(
    "Name:",
    file.originalname
  );
  console.log(
    "MIME:",
    file.mimetype
  );
  console.log(
    "Encoding:",
    file.encoding
  );
  console.log("=================================");


  const extension =
    path.extname(
      file.originalname
    ).toLowerCase();


  // Check extension
  if (
    !allowedExtensions.includes(
      extension
    )
  ) {
    return cb(
      new Error(
        `Only JPG, JPEG, PNG, WEBP, GIF and BMP files are allowed. ` +
        `Received extension: ${extension}`
      )
    );
  }


  // Check MIME
  if (
    !allowedMimeTypes.includes(
      file.mimetype
    )
  ) {
    return cb(
      new Error(
        `Invalid image MIME type: ${file.mimetype}`
      )
    );
  }


  cb(null, true);
};


// ============================================================
// MULTER
// ============================================================

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize:
      10 * 1024 * 1024,
  },
});


module.exports = upload;