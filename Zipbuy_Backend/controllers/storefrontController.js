import User from "../models/userModel.js";
import productSchema from "../productSchema.js";

// Get public business profile + their products
export const getStorefront = async (req, res) => {
  try {
    const business = await User.findOne({
      _id: req.params.businessId,
      role: "business",
      verificationStatus: "approved",
      isActive: true,
    }).select("-password -documents -verificationNotes");

    if (!business) {
      return res.status(404).json({ message: "Store not found" });
    }

    const products = await productSchema.find({
      business: req.params.businessId,
      productStatus: "active",
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      store: {
        business: {
          id: business._id,
          name: business.name,
          businessProfile: business.businessProfile,
          email: business.email,
          phone: business.phone,
          joinedAt: business.createdAt,
        },
        products,
        productCount: products.length,
      },
    });
  } catch (error) {
    console.error("Storefront error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// List all verified businesses (for directory)
export const listBusinesses = async (req, res) => {
  try {
    const { page = 1, limit = 20, category } = req.query;

    const filter = {
      role: "business",
      verificationStatus: "approved",
      isActive: true,
    };
    if (category) {
      filter["businessProfile.category"] = category;
    }

    const businesses = await User.find(filter)
      .select("name email phone businessProfile createdAt")
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
    console.error("List businesses error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
