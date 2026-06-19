import express from "express";
import {
  getBusinesses,
  getBusinessById,
  approveBusiness,
  rejectBusiness,
  requestInfo,
  toggleBusinessStatus,
} from "../controllers/adminBusinessController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/businesses", getBusinesses);
router.get("/businesses/:id", getBusinessById);
router.put("/businesses/:id/approve", approveBusiness);
router.put("/businesses/:id/reject", rejectBusiness);
router.put("/businesses/:id/request-info", requestInfo);
router.put("/businesses/:id/toggle-status", toggleBusinessStatus);

export default router;
