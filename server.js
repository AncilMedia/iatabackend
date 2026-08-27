require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const portfolioRoutes = require("./src/routes/portfolioRoutes");
const settingsRoutes = require("./src/routes/settingsRoutes");
const enquiryRoutes = require("./src/routes/enquiryRoutes");

const app = express();

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin: true,
    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "X-Requested-With",
    ],
  })
);

/*
|--------------------------------------------------------------------------
| BODY PARSER
|--------------------------------------------------------------------------
*/

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

app.use(cookieParser());

/*
|--------------------------------------------------------------------------
| REQUEST LOGGER
|--------------------------------------------------------------------------
*/

app.use((req, res, next) => {
  console.log("=================================");
  console.log("REQUEST");
  console.log("=================================");
  console.log("Method:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("Origin:", req.headers.origin || "No origin");
  console.log(
    "User-Agent:",
    req.headers["user-agent"] || "No user-agent"
  );
  console.log("=================================");

  next();
});

/*
|--------------------------------------------------------------------------
| HEALTH
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "IATA backend API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

/*
|--------------------------------------------------------------------------
| ROUTES
|--------------------------------------------------------------------------
*/

app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/enquiries", enquiryRoutes);

/*
|--------------------------------------------------------------------------
| 404
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/*
|--------------------------------------------------------------------------
| ERROR HANDLER
|--------------------------------------------------------------------------
*/

app.use((err, req, res, next) => {
  console.error("=================================");
  console.error("SERVER ERROR");
  console.error("=================================");
  console.error(err);
  console.error("=================================");

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

/*
|--------------------------------------------------------------------------
| START SERVER
|--------------------------------------------------------------------------
*/

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log("=================================");
      console.log("IATA BACKEND");
      console.log("=================================");
      console.log(
        `Server running on http://localhost:${PORT}`
      );
      console.log(
        `Portfolio API: http://localhost:${PORT}/api/portfolio`
      );
      console.log("=================================");
    });
  } catch (error) {
    console.error(
      "Unable to start server because MongoDB connection failed."
    );

    process.exit(1);
  }
};

startServer();

module.exports = app;