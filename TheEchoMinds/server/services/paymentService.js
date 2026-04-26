import Razorpay from "razorpay";
import crypto from "node:crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export function createRazorpayOrder(amount, receiptId, currency = "INR") {
  return razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency,
    receipt: receiptId,
  });
}

export function verifyRazorpaySignature(orderId, paymentId, signature) {
  const body = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");
  return expected === signature;
}
