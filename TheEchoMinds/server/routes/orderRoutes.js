import express from "express";
import { requireVerified } from "../middleware/auth.js";
import {
  createRazorpayOrderController,
  verifyPayment,
  getMyOrders,
  confirmDelivery,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/create-razorpay-order", requireVerified, createRazorpayOrderController);
router.post("/verify", requireVerified, verifyPayment);
router.get("/me", requireVerified, getMyOrders);
router.post("/:orderId/confirm-delivery", requireVerified, confirmDelivery);

export default router;
