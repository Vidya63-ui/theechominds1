import mongoose from "mongoose";

const productStockSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
  },
  { timestamps: true },
);

export const ProductStock = mongoose.model("ProductStock", productStockSchema);
