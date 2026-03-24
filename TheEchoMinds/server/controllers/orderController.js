import { Order } from "../models/Order.js";
import { User } from "../models/User.js";
import { createRazorpayOrder, verifyRazorpaySignature } from "../services/paymentService.js";
import { sendOrderConfirmation } from "../services/emailService.js";
import { generateOrderId } from "../utils/generateId.js";
import { success, error } from "../utils/response.js";

export async function createRazorpayOrderController(req, res) {
  try {
    const { amount, product } = req.body;
    if (!amount || amount <= 0) {
      return error(res, "Valid amount is required", 400);
    }

    const orderId = generateOrderId();
    const razorpayOrder = await createRazorpayOrder(
      Number(amount),
      orderId
    );

    res.locals.pendingOrder = {
      userId: req.user._id,
      product: product || {},
      internalOrderId: orderId,
      amount: Number(amount),
    };

    return success(res, {
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      receipt: razorpayOrder.receipt,
    });
  } catch (err) {
    console.error("Create Razorpay order error:", err);
    return error(res, "Failed to create payment order", 500);
  }
}

/** Verify Razorpay payment and save order - called after frontend completes payment */
export async function verifyPayment(req, res) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, product, amount } = req.body;
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return error(res, "razorpayOrderId, razorpayPaymentId and razorpaySignature are required", 400);
    }

    const isValid = verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );
    if (!isValid) {
      return error(res, "Invalid payment signature", 400);
    }

    const userId = req.user._id;
    const orderId = generateOrderId();
    const amountInr = amount != null ? Number(amount) : 0;

    const order = await Order.create({
      userId,
      product: product || {},
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      amount: amountInr,
      status: "confirmed",
    });

    const user = await User.findById(userId).select("email").lean();
    try {
      await sendOrderConfirmation(
        user.email,
        orderId,
        razorpayPaymentId,
        product || order.product
      );
    } catch (emailErr) {
      console.error("Failed to send order confirmation:", emailErr);
    }

    return success(res, {
      order: {
        _id: order._id,
        orderId: order.orderId,
        razorpayPaymentId: order.razorpayPaymentId,
        status: order.status,
        createdAt: order.createdAt,
      },
    }, 201);
  } catch (err) {
    console.error("Verify payment error:", err);
    return error(res, "Failed to verify payment", 500);
  }
}

export async function getMyOrders(req, res) {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    return success(res, { orders });
  } catch (err) {
    console.error("Get orders error:", err);
    return error(res, "Failed to fetch orders", 500);
  }
}
