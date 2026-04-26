import { Order } from "../models/Order.js";
import { User } from "../models/User.js";
import { createRazorpayOrder, verifyRazorpaySignature } from "../services/paymentService.js";
import { sendOrderConfirmation } from "../services/emailService.js";
import { generateOrderId } from "../utils/generateId.js";
import { success, error } from "../utils/response.js";
import { expectedOrderTotalInr } from "../lib/orderPricing.js";

export async function createRazorpayOrderController(req, res) {
  try {
    const { product } = req.body;
    const authorizedInr = expectedOrderTotalInr(product || {});
    if (authorizedInr == null || authorizedInr <= 0) {
      return error(res, "Valid product payload is required to determine the payable amount", 400);
    }

    const orderId = generateOrderId();
    const razorpayOrder = await createRazorpayOrder(authorizedInr, orderId);

    res.locals.pendingOrder = {
      userId: req.user._id,
      product: product || {},
      internalOrderId: orderId,
      amount: authorizedInr,
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
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, product } = req.body;
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
    const authorizedInr = expectedOrderTotalInr(product || {});
    if (authorizedInr == null || authorizedInr <= 0) {
      return error(res, "Unable to verify order amount from product payload", 400);
    }

    const order = await Order.create({
      userId,
      product: product || {},
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      amount: authorizedInr,
      status: "processing",
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

/** Mark order as delivered (buyer confirmed receipt) — required before product reviews. */
export async function confirmDelivery(req, res) {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return error(res, "orderId is required", 400);
    }
    const order = await Order.findOne({
      orderId: String(orderId).trim(),
      userId: req.user._id,
    });
    if (!order) {
      return error(res, "Order not found", 404);
    }
    if (order.status === "delivered") {
      return error(res, "Order already marked as delivered", 400);
    }
    const canConfirm = ["confirmed", "processing", "shipped"].includes(order.status);
    if (!canConfirm) {
      return error(res, "Only active paid orders can be marked as delivered", 400);
    }
    order.status = "delivered";
    await order.save();
    return success(res, {
      order: {
        _id: order._id,
        orderId: order.orderId,
        status: order.status,
        updatedAt: order.updatedAt,
      },
    });
  } catch (err) {
    console.error("Confirm delivery error:", err);
    return error(res, "Failed to update order", 500);
  }
}
