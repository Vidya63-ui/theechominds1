import mongoose from "mongoose";

const preorderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    preorderId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

preorderSchema.index({ userId: 1 });

export const Preorder = mongoose.model("Preorder", preorderSchema);
