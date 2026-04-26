import { Preorder } from "../models/Preorder.js";
import { generatePreorderId } from "../utils/generateId.js";
import { sendPreorderThankYou } from "../services/emailService.js";
import { success, error } from "../utils/response.js";

export async function createPreorder(req, res) {
  try {
    const userId = req.user._id;
    const product = req.body.product ?? {
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      model: req.body.model,
      city: req.body.city ?? "",
    };

    const hasProduct = product && (product.fullName || product.model || product.email);
    if (!hasProduct) {
      return error(res, "fullName, email, phone and model are required", 400);
    }

    const preorderId = generatePreorderId();
    const preorder = await Preorder.create({
      userId,
      product,
      preorderId,
      status: "pending",
    });

    try {
      await sendPreorderThankYou(req.user.email, preorderId);
    } catch (emailErr) {
      console.error("Failed to send preorder email:", emailErr);
    }

    return success(res, {
      preorder: {
        _id: preorder._id,
        preorderId: preorder.preorderId,
        product: preorder.product,
        status: preorder.status,
        createdAt: preorder.createdAt,
      },
    }, 201);
  } catch (err) {
    console.error("Create preorder error:", err);
    return error(res, "Failed to create preorder", 500);
  }
}

export async function getMyPreorders(req, res) {
  try {
    const preorders = await Preorder.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    return success(res, { preorders });
  } catch (err) {
    console.error("Get preorders error:", err);
    return error(res, "Failed to fetch preorders", 500);
  }
}
