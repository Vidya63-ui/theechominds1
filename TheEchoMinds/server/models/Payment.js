import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    preorder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Preorder",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },
    transactionId: {
      type: String,
      required: true,
      trim: true,
    },
    screenshotPath: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Payment = mongoose.model("Payment", paymentSchema);
