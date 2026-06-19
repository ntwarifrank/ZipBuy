import express from "express";
import { getStorefront, listBusinesses } from "../controllers/storefrontController.js";

const router = express.Router();

router.get("/stores", listBusinesses);
router.get("/stores/:businessId", getStorefront);

export default router;
