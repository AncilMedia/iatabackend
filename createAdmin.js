require("dotenv").config();

const bcrypt = require("bcryptjs");

const connectDB = require("./src/config/db");
const User = require("./src/models/User");

const createAdmin = async () => {
  await connectDB();

  const email = "admin@example.com";
  const password = "Admin@123456";

  const existing = await User.findOne({
    email,
  });

  if (existing) {
    console.log("Admin already exists");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(
    password,
    12
  );

  const admin = await User.create({
    name: "Admin",
    email,
    password: hashedPassword,
    role: "admin",
  });

  console.log("Admin created:");
  console.log("Email:", admin.email);
  console.log("Password:", password);

  process.exit(0);
};

createAdmin();