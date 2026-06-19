import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  email: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: { type: String, default: "" },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  streetAddress: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  currency: { type: String, enum: ["RWF", "USD"], default: "RWF" },
  orderToken: { type: String, required: true },

  // Multi-vendor support
  business: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  // Order lifecycle
  orderStatus: {
    type: String,
    enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"],
    default: "pending",
  },

  // Payment
  isPaid: { type: Boolean, default: false },
  paymentMethod: {
    type: String,
    enum: ["mtn_momo", "airtel_money", "stripe"],
  },
  paymentDetails: {
    transactionId: { type: String, default: "" },
    reference: { type: String, default: "" },
    paidAt: { type: Date },
  },

  cartProducts: { type: Array, required: true },
  adminNotes: { type: String, default: "" },
}, { timestamps: true });

const placeOrderSchema = mongoose.model("placeOrderSchema", orderSchema);
export default placeOrderSchema;
