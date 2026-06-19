import productSchema from "../productSchema.js";
import { v2 as cloudinary } from "cloudinary";
import stream from "stream";

// Get all products for the logged-in business
export const getMyProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const filter = { business: req.user.id };
    if (status) filter.productStatus = status;
    if (search) filter.productName = { $regex: search, $options: "i" };

    const products = await productSchema
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await productSchema.countDocuments(filter);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get my products error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single product (scoped to business)
export const getMyProduct = async (req, res) => {
  try {
    const product = await productSchema.findOne({
      _id: req.params.id,
      business: req.user.id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Get my product error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create product (business-scoped)
export const createProduct = async (req, res) => {
  try {
    const {
      productName,
      productPrice,
      productQuantity,
      productCategory,
      productDiscount,
      productDescription,
      productShipping,
      currency,
    } = req.body;

    if (!productName || !productPrice || !productQuantity || !productCategory || !productDescription) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let uploadedImageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadResult = await new Promise((resolve, reject) => {
          const bufferStream = new stream.PassThrough();
          bufferStream.end(file.buffer);

          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: `business_products/${req.user.id}` },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          bufferStream.pipe(uploadStream);
        });
        uploadedImageUrls.push(uploadResult.secure_url);
      }
    }

    const shippingDetails = typeof productShipping === "string"
      ? JSON.parse(productShipping)
      : productShipping || [];

    const product = await productSchema.create({
      productName,
      productPrice,
      productQuantity,
      productCategory,
      productDiscount: productDiscount || 0,
      productDescription,
      productImages: uploadedImageUrls,
      productShipping: shippingDetails,
      currency: currency || "RWF",
      business: req.user.id,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update product (scoped to business)
export const updateMyProduct = async (req, res) => {
  try {
    const product = await productSchema.findOne({
      _id: req.params.id,
      business: req.user.id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const allowedFields = [
      "productName", "productPrice", "productQuantity", "productCategory",
      "productDiscount", "productDescription", "productStatus", "currency",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    }

    if (req.body.productShipping) {
      product.productShipping = typeof req.body.productShipping === "string"
        ? JSON.parse(req.body.productShipping)
        : req.body.productShipping;
    }

    if (req.files && req.files.length > 0) {
      const newImages = [];
      for (const file of req.files) {
        const uploadResult = await new Promise((resolve, reject) => {
          const bufferStream = new stream.PassThrough();
          bufferStream.end(file.buffer);

          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: `business_products/${req.user.id}` },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          bufferStream.pipe(uploadStream);
        });
        newImages.push(uploadResult.secure_url);
      }
      product.productImages = newImages;
    }

    await product.save();

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete product (scoped to business)
export const deleteMyProduct = async (req, res) => {
  try {
    const product = await productSchema.findOneAndDelete({
      _id: req.params.id,
      business: req.user.id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
