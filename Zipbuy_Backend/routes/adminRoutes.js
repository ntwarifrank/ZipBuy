import express from "express";
import {
  getDashboard,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getCustomers,
  toggleCustomerStatus,
  getProducts,
  toggleProductStatus,
  deleteProduct,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/dashboard", getDashboard);
router.get("/orders", getOrders);
router.get("/orders/:id", getOrderById);
router.put("/orders/:id/status", updateOrderStatus);
router.get("/customers", getCustomers);
router.put("/customers/:id/toggle-status", toggleCustomerStatus);
router.get("/products", getProducts);
router.put("/products/:id/toggle-status", toggleProductStatus);
router.delete("/products/:id", deleteProduct);

export default router;
