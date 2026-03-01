import express from "express";
import { requireVerified } from "../middleware/auth.js";
import {
  createRazorpayOrderController,
  verifyPayment,
  getMyOrders,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/create-razorpay-order", requireVerified, createRazorpayOrderController);
router.post("/verify", requireVerified, verifyPayment);
router.get("/me", requireVerified, getMyOrders);

export default router;
