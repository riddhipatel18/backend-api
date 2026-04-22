const mongoose = require("mongoose");
require("dotenv").config();

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is missing in .env");
  }

  await mongoose.connect(uri);
  console.log("✅ Connected to MongoDB");
}

module.exports = connectDB;
