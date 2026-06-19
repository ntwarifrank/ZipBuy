import express from "express";
import multer from "multer";
import {
  getMyProducts,
  getMyProduct,
  createProduct,
  updateMyProduct,
  deleteMyProduct,
} from "../controllers/businessProductController.js";
import { protect, verifiedBusinessOnly } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(protect, verifiedBusinessOnly);

router.get("/products", getMyProducts);
router.get("/products/:id", getMyProduct);
router.post("/products", upload.array("images", 10), createProduct);
router.put("/products/:id", upload.array("images", 10), updateMyProduct);
router.delete("/products/:id", deleteMyProduct);

export default router;
