import User from "../models/userModel.js";

// Get all businesses (filtered by verificationStatus)
export const getBusinesses = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = { role: "business" };
    if (status && ["none", "pending", "approved", "rejected", "info_needed"].includes(status)) {
      filter.verificationStatus = status;
    }
    if (req.query.search) {
      const s = req.query.search;
      filter.$or = [
        { email: { $regex: s, $options: "i" } },
        { firstName: { $regex: s, $options: "i" } },
        { lastName: { $regex: s, $options: "i" } },
        { name: { $regex: s, $options: "i" } },
        { "businessProfile.businessName": { $regex: s, $options: "i" } },
        { mobileNumber: { $regex: s, $options: "i" } },
        { phone: { $regex: s, $options: "i" } },
      ];
    }

    const businesses = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      businesses,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get businesses error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single business details
export const getBusinessById = async (req, res) => {
  try {
    const business = await User.findOne({
      _id: req.params.id,
      role: "business",
    }).select("-password");

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    res.status(200).json({ success: true, business });
  } catch (error) {
    console.error("Get business error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Approve business
export const approveBusiness = async (req, res) => {
  try {
    const { notes, documentsVerified } = req.body;

    const business = await User.findOne({
      _id: req.params.id,
      role: "business",
    });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    business.verificationStatus = "approved";
    business.verifiedAt = new Date();
    business.verifiedBy = req.user.id;
    if (notes) business.verificationNotes = notes;
    if (documentsVerified) {
      business.documentsVerified = documentsVerified;
      business.documentsVerifiedAt = new Date();
    }
    await business.save();

    res.status(200).json({
      success: true,
      message: "Business approved successfully",
      business,
    });
  } catch (error) {
    console.error("Approve business error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Reject business
export const rejectBusiness = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: "Rejection reason is required" });
    }

    const business = await User.findOne({
      _id: req.params.id,
      role: "business",
    });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    business.verificationStatus = "rejected";
    business.verificationNotes = reason;
    business.verifiedBy = req.user.id;
    await business.save();

    res.status(200).json({
      success: true,
      message: "Business rejected",
      business,
    });
  } catch (error) {
    console.error("Reject business error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Request more info from business
export const requestInfo = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Info request message is required" });
    }

    const business = await User.findOne({
      _id: req.params.id,
      role: "business",
    });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    business.verificationStatus = "info_needed";
    business.verificationNotes = message;
    business.verifiedBy = req.user.id;
    await business.save();

    res.status(200).json({
      success: true,
      message: "Info request sent to business",
      business,
    });
  } catch (error) {
    console.error("Request info error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Suspend/activate business account
export const toggleBusinessStatus = async (req, res) => {
  try {
    const business = await User.findOne({
      _id: req.params.id,
      role: "business",
    });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    business.isActive = !business.isActive;
    await business.save();

    res.status(200).json({
      success: true,
      message: `Business ${business.isActive ? "activated" : "suspended"}`,
      isActive: business.isActive,
    });
  } catch (error) {
    console.error("Toggle business status error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
