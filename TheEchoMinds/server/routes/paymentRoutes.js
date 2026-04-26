import express from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { requireAuth } from "../middleware/auth.js";
import { Preorder } from "../models/Preorder.js";
import { Payment } from "../models/Payment.js";

const router = express.Router();

const uploadDir = path.resolve("server/uploads/payments");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      return cb(null, true);
    }
    return cb(new Error("Only image files are allowed"));
  },
});

router.post("/:preorderId/upload", requireAuth, upload.single("screenshot"), async (req, res) => {
  try {
    const { preorderId } = req.params;
    const { amount, paymentMethod, transactionId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Payment screenshot is required" });
    }
    if (!amount || !paymentMethod || !transactionId) {
      return res.status(400).json({ message: "amount, paymentMethod and transactionId are required" });
    }

    const preorder = await Preorder.findOne({ _id: preorderId, user: req.user._id });
    if (!preorder) {
      return res.status(404).json({ message: "Preorder not found" });
    }

    const payment = await Payment.create({
      preorder: preorder._id,
      user: req.user._id,
      amount: Number(amount),
      paymentMethod,
      transactionId,
      screenshotPath: `/uploads/payments/${req.file.filename}`,
    });

    preorder.paymentStatus = "submitted";
    await preorder.save();

    return res.status(201).json({ payment });
  } catch (error) {
    return res.status(500).json({ message: "Failed to upload payment details" });
  }
});

export default router;
