import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/userModel.js";

dotenv.config();

const ADMIN_EMAIL = "ntwarifrank100@gmail.com";
const ADMIN_PASSWORD = "Ntwari@2005";
const ADMIN_NAME = "Super Admin";

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL || "mongodb://localhost:27017/zipbuy");
    console.log("Connected to MongoDB");

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log("Admin already exists, updating...");
      existing.name = ADMIN_NAME;
      existing.role = "admin";
      existing.isAdmin = true;
      existing.isActive = true;
      existing.password = ADMIN_PASSWORD;
      await existing.save();
      console.log("Admin updated");
    } else {
      await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: "admin",
        isAdmin: true,
        isActive: true,
      });
      console.log("Admin created");
    }

    await mongoose.disconnect();
    console.log("Done");
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

seed();
