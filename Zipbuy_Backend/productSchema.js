import mongoose from "mongoose";

const productSchemaDesign = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: ["RWF", "USD"],
      default: "RWF",
    },
    productShipping: {
      type: Array,
      required: true,
    },
    productQuantity: {
      type: Number,
      required: true,
    },
    productDiscount: {
      type: Number,
      required: true,
    },
    productCategory: {
      type: String,
      required: true,
    },
    productDescription: {
      type: String,
      required: true,
    },
    productImages: {
      type: Array,
      required: true,
    },
    productStatus: {
      type: String,
      enum: ["active", "inactive", "out_of_stock", "discontinued"],
      default: "active",
    },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = mongoose.model("productsData", productSchemaDesign);
export default productSchema;
