import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { Preorder } from "../models/Preorder.js";

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
  try {
    const { fullName, email, phone, model, city } = req.body;
    if (!fullName || !email || !phone || !model) {
      return res.status(400).json({ message: "fullName, email, phone and model are required" });
    }

    const preorder = await Preorder.create({
      user: req.user._id,
      fullName,
      email,
      phone,
      model,
      city: city || "",
    });

    return res.status(201).json({ preorder });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create preorder" });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const preorders = await Preorder.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json({ preorders });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch preorders" });
  }
});

export default router;
