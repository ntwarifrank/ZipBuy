import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "yourverysecretkey";
const JWT_EXPIRY = process.env.JWT_EXPIRY || "1h";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin,
      verificationStatus: user.verificationStatus
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
};

const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });
};

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  isAdmin: user.isAdmin,
  verificationStatus: user.verificationStatus,
  businessProfile: user.businessProfile,
  isActive: user.isActive
});

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const userRole = role === "business" ? "business" : "client";

    const nameParts = name.trim().split(/\s+/);
    const user = new User({
      name,
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
      email,
      password,
      phone: phone || "",
      role: userRole
    });

    await user.save();

    const token = generateToken(user);
    setTokenCookie(res, token);

    res.status(201).json({
      success: true,
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account suspended. Contact admin." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);
    setTokenCookie(res, token);

    res.status(200).json({
      success: true,
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.role !== "admin" && !user.isAdmin) {
      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
        isAdmin: false
      });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account suspended." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);
    setTokenCookie(res, token);

    res.status(200).json({
      success: true,
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Logout user
export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
