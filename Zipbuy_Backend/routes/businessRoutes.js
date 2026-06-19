import express from "express";
import multer from "multer";
import {
  getMyBusinessProfile,
  updateBusinessProfile,
  uploadBusinessLogo,
  uploadDocument,
  submitForVerification,
  getMyBusinessOrders,
} from "../controllers/businessController.js";
import { protect, businessOnly } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(protect, businessOnly);

router.get("/profile", getMyBusinessProfile);
router.put("/profile", updateBusinessProfile);
router.post("/logo", upload.single("logo"), uploadBusinessLogo);
router.post("/documents", upload.single("document"), uploadDocument);
router.post("/submit-verification", submitForVerification);
router.get("/orders", getMyBusinessOrders);

export default router;
