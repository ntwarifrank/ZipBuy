import productSchema from "../productSchema.js";
import placeOrderSchema from "../placeOrderSchema.js"
import Stripe from "stripe";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import stream from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const stripe = Stripe(
  process.env.STRIPE_SECRET_KEY
);

dotenv.config();
const secret_key = process.env.SECRET_KEY;

// that is router to display all product we have in database
export const allProduct = async (req, res) => {
  try {
    const productsData = await productSchema.find().populate("business", "name businessProfile.businessName businessProfile.businessLogo");
    if (productsData) {
      res.status(200).json({ success: true, productData: productsData });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed To Fetch Data" });
  }
};

//that is router to fetch only one choosen product
export const Product = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productSchema.findOne({ _id: id });

    if (product) {
      res.status(200).json({ success: true, product });
    } else {
      res.status(404).json({ success: false, message: "Product not found" });
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ success: false, message: "Failed to fetch product" });
  }
};

//that is router to update choosen product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const {
      productName,
      productPrice,
      productQuantity,
      productCategory,
      productDescription,
      productImages,
      productShipping,
      productDiscount,
    } = req.body;

    let imageUrls = [];
    if (productImages) {
      imageUrls = typeof productImages === "string" ? JSON.parse(productImages) : productImages;
    }

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadResult = await new Promise((resolve, reject) => {
          const bufferStream = new stream.PassThrough();
          bufferStream.end(file.buffer);
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "uploads" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          bufferStream.pipe(uploadStream);
        });
        imageUrls.push(uploadResult.secure_url);
      }
    }

    const shippingDetails = productShipping
      ? (typeof productShipping === "string" ? JSON.parse(productShipping) : productShipping)
      : undefined;

    const createdProduct = await productSchema.findByIdAndUpdate(id, {
      productName,
      productPrice,
      productQuantity,
      productCategory,
      productDiscount: Number(productDiscount),
      productDescription,
      productImages: imageUrls,
      productShipping: shippingDetails,
    }, { new: true });

    if (createdProduct) {
      res.status(200).json({ success: true, message: "Product updated successfully", data: createdProduct });
    } else {
      res.status(400).json({ success: false, message: "Failed to update product" });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//that is router to delete choosen product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productToDelete = await productSchema.findOneAndDelete({ _id: id });

    if (!productToDelete) {
      res
        .status(400)
        .json({ success: false, message: "Failed To Delete That Product" });
    }

    res
      .status(200)
      .json({ success: true, message: "Product Deleted Successsfully" });
  } catch (error) {
    res.status(400).json({ sucess: false, message: "server error" });
  }
};

export const specificProduct = async (req, res) => {
  const { ids } = req.body;

  res.json(await productSchema.find({ _id: ids }));
};

// that is router to place order and get data of order from front-end
export const placeOrder = async (req, res) => {
  try {
    const {
      email,
      fullName,
      city,
      postalCode,
      streetAddress,
      country,
      orderToken,
      cartProducts,
      totalAmount,
    } = req.body;
    if (
      !email ||
      !fullName ||
      !city ||
      !postalCode ||
      !streetAddress ||
      !country ||
      !orderToken ||
      !cartProducts ||
      !totalAmount
    ) {
      res
        .status(400)
        .json({ success: false, message: "All Field Are Required" });
      return;
    }

    // Look up products to find the business owner (multi-vendor)
    const productIds = cartProducts.map(p => p._id || p.id).filter(Boolean);
    const products = productIds.length > 0 ? await productSchema.find({ _id: { $in: productIds } }).select("business").lean() : [];
    const businessIds = [...new Set(products.map(p => p.business?.toString()).filter(Boolean))];
    const business = businessIds.length === 1 ? businessIds[0] : null;

    const order = await placeOrderSchema.create({
      email,
      fullName,
      city,
      postalCode,
      streetAddress,
      country,
      orderToken,
      cartProducts,
      totalAmount,
      business,
    });

    if (!order) {
      res.status(400).json({ success: false, message: "failed to PlaceOrder" });
      return;
    }
    res
      .status(200)
      .json({ success: true, message: "order created successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: "server error" });
  }
};

//that is route for searching specific product
export const searchedProduct = async (req, res) => {
  const { search } = req.body;

  try {
    if (!search ) {
      return res
        .status(400)
        .json({ success: false, message: "Search query is required" });
    }

    let searchedProducts = await productSchema.find({
      productName: { $regex: search, $options: "i" },
    })

    if(searchedProducts.length == 0){
      searchedProducts =  await productSchema.find({
        productCategory: { $regex: search, $options: "i" },
      });
    }

    if (searchedProducts.length > 0) {
      return res
        .status(200)
        .json({ success: true, products: searchedProducts });
    } else {
      const defaultProduct = {
        _id: "0",
        productName: "Not Found ",
        productPrice: 0,
        productShipping: [
          { weight: "0" },
          { dimensions: "0" },
          { shippingCost: 0 },
          { estimatedDelivery: "0" },
        ],
        productQuantity: 0,
        productDiscount: 0,
        productCategory: "",
        productDescription: "not found",
        productImages: [
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0ggQy-W2LxZYOyfOKakhCDf7KFQ0KdumDXA&s",
        ],
      };

      return res
        .status(200)
        .json({ success: true, products: [defaultProduct] });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

//that router is for payment indent to send clientsecret to the front-end
export const paymentIndent = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency,
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
};

//that is for related product
export const relatedProduct = async(req, res) => {
  const {category}  = req.body;

  const relatedProduct = await productSchema.find({
    productCategory: category,
  });

  if(!relatedProduct){
    res.status(400).json({ success: false, message:"No Related Product"});
    return;
  }

  res.status(200).json({products: relatedProduct});
};