import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import stream from "stream";

// Get own business profile
export const getMyBusinessProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user || user.role !== "business") {
      return res.status(404).json({ message: "Business profile not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Get business profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update business profile
export const updateBusinessProfile = async (req, res) => {
  try {
    const {
      businessName,
      businessRegNumber,
      businessTaxId,
      businessPhone,
      businessAddress,
      businessDescription,
      category,
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user || user.role !== "business") {
      return res.status(404).json({ message: "Business profile not found" });
    }

    if (businessName !== undefined) user.businessProfile.businessName = businessName;
    if (businessRegNumber !== undefined) user.businessProfile.businessRegNumber = businessRegNumber;
    if (businessTaxId !== undefined) user.businessProfile.businessTaxId = businessTaxId;
    if (businessPhone !== undefined) user.businessProfile.businessPhone = businessPhone;
    if (businessDescription !== undefined) user.businessProfile.businessDescription = businessDescription;
    if (category !== undefined) user.businessProfile.category = category;
    if (businessAddress !== undefined) {
      user.businessProfile.businessAddress = {
        ...user.businessProfile.businessAddress,
        ...businessAddress,
      };
    }

    await user.save();

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Update business profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Upload business logo
export const uploadBusinessLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(req.user.id);
    if (!user || user.role !== "business") {
      return res.status(404).json({ message: "Business profile not found" });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const bufferStream = new stream.PassThrough();
      bufferStream.end(req.file.buffer);

      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "business_logos" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      bufferStream.pipe(uploadStream);
    });

    user.businessProfile.businessLogo = uploadResult.secure_url;
    await user.save();

    res.status(200).json({ success: true, logoUrl: uploadResult.secure_url });
  } catch (error) {
    console.error("Logo upload error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Upload verification document
export const uploadDocument = async (req, res) => {
  try {
    const { documentType } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const validTypes = ["rdb_certificate", "tax_clearance", "national_id", "trading_license"];
    if (!validTypes.includes(documentType)) {
      return res.status(400).json({ message: "Invalid document type" });
    }

    const user = await User.findById(req.user.id);
    if (!user || user.role !== "business") {
      return res.status(404).json({ message: "Business profile not found" });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const bufferStream = new stream.PassThrough();
      bufferStream.end(req.file.buffer);

      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: `business_documents/${req.user.id}` },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      bufferStream.pipe(uploadStream);
    });

    // Remove old document of same type
    user.documents = user.documents.filter((d) => d.type !== documentType);

    user.documents.push({
      name: req.file.originalname,
      url: uploadResult.secure_url,
      type: documentType,
    });

    await user.save();

    res.status(200).json({ success: true, documents: user.documents });
  } catch (error) {
    console.error("Document upload error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Submit business for verification
export const submitForVerification = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "business") {
      return res.status(404).json({ message: "Business profile not found" });
    }

    if (user.verificationStatus === "approved") {
      return res.status(400).json({ message: "Business already verified" });
    }

    if (user.verificationStatus === "pending") {
      return res.status(400).json({ message: "Verification already in progress" });
    }

    // Require business name and at least one document
    if (!user.businessProfile.businessName) {
      return res.status(400).json({ message: "Business name is required" });
    }

    if (user.documents.length === 0) {
      return res.status(400).json({ message: "At least one verification document is required" });
    }

    user.verificationStatus = "pending";
    user.verificationNotes = "";
    await user.save();

    res.status(200).json({ success: true, verificationStatus: "pending" });
  } catch (error) {
    console.error("Submit verification error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get orders for my business
export const getMyBusinessOrders = async (req, res) => {
  try {
    const Order = (await import("../placeOrderSchema.js")).default;
    const { page = 1, limit = 15, status } = req.query;

    const filter = { business: req.user.id };
    if (status) filter.orderStatus = status;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      orders,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get business orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
