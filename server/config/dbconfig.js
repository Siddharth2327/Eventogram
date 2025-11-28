const mongoose = require('mongoose');
require("dotenv").config();
const dbstring = process.env.DBstring;

const connectDB = async () => {
  try {
    await mongoose.connect(dbstring);
    console.log("DB connected successfully");
  } catch (err) {
    console.error("DB connection failed:", err.message);
    process.exit(1);  // optional but recommended for production
  }
};

module.exports = connectDB;