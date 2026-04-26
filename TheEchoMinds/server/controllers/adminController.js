import { Order } from "../models/Order.js";
import { ProductStock } from "../models/ProductStock.js";
import { success, error } from "../utils/response.js";

const ORDER_STATUSES = ["confirmed", "processing", "shipped", "delivered", "failed", "refunded"];

const DEFAULT_PRODUCT_ROWS = [
  { slug: "g1", name: "EchoLens G.1", stock: 50 },
  { slug: "s1", name: "EchoLens S.1", stock: 50 },
];

function skuHintFromText(name) {
  const n = String(name || "").toLowerCase();
  if (n.includes("cart order")) return null;
  if (/\bg\.?1\b/.test(n) || n.includes("g1")) return "g1";
  if (/\bs\.?1\b/.test(n) || n.includes("s1")) return "s1";
  return null;
}

/** Approximate units sold from delivered orders (for admin reference). */
function soldUnitsBySkuFromOrders(orders) {
  const counts = { g1: 0, s1: 0 };
  for (const o of orders) {
    if (o.status !== "delivered") continue;
    const p = o.product || {};
    const lines = p.lineItems;
    if (Array.isArray(lines) && lines.length > 0) {
      for (const line of lines) {
        const sku = String(line.sku || "").toLowerCase();
        const qty = Math.max(0, Math.floor(Number(line.qty) || 1));
        if (sku === "g1" || sku === "s1") counts[sku] += qty;
      }
    } else {
      const hint = skuHintFromText(p.name) || skuHintFromText(p.model);
      if (hint) counts[hint] += 1;
    }
  }
  return counts;
}

async function ensureDefaultProductStock() {
  const n = await ProductStock.countDocuments();
  if (n > 0) return;
  await ProductStock.insertMany(DEFAULT_PRODUCT_ROWS);
}

export async function adminListOrders(req, res) {
  try {
    const raw = String(req.query.status || "all").toLowerCase();
    const filter = {};
    if (raw !== "all" && ORDER_STATUSES.includes(raw)) {
      filter.status = raw;
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate("userId", "email name phone")
      .lean();

    const delivered = await Order.find({ status: "delivered" }).lean();
    const inProcess = await Order.countDocuments({
      status: { $in: ["confirmed", "processing", "shipped"] },
    });
    const done = await Order.countDocuments({ status: "delivered" });

    return success(res, {
      orders,
      counts: {
        inProcess,
        done,
        total: await Order.countDocuments(),
      },
      soldApprox: soldUnitsBySkuFromOrders(delivered),
    });
  } catch (err) {
    console.error("adminListOrders:", err);
    return error(res, "Failed to load orders", 500);
  }
}

export async function adminUpdateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const nextStatus = String(req.body?.status || "").trim();
    if (!orderId || !ORDER_STATUSES.includes(nextStatus)) {
      return error(res, "Valid orderId and status are required", 400);
    }

    const order = await Order.findOne({ orderId: String(orderId).trim() });
    if (!order) {
      return error(res, "Order not found", 404);
    }

    order.status = nextStatus;
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
    console.error("adminUpdateOrderStatus:", err);
    return error(res, "Failed to update order", 500);
  }
}

export async function adminListProducts(req, res) {
  try {
    await ensureDefaultProductStock();
    const products = await ProductStock.find().sort({ slug: 1 }).lean();
    const delivered = await Order.find({ status: "delivered" }).lean();
    const soldApprox = soldUnitsBySkuFromOrders(delivered);

    const merged = products.map((p) => ({
      ...p,
      soldApprox: soldApprox[p.slug] ?? 0,
    }));

    return success(res, { products: merged });
  } catch (err) {
    console.error("adminListProducts:", err);
    return error(res, "Failed to load products", 500);
  }
}

export async function adminUpdateProductStock(req, res) {
  try {
    const slug = String(req.params.slug || "").trim().toLowerCase();
    const n = Number(req.body?.stock);
    if (!slug || !Number.isFinite(n)) {
      return error(res, "Valid slug and stock number are required", 400);
    }
    const stock = Math.max(0, Math.floor(n));

    await ensureDefaultProductStock();
    const doc = await ProductStock.findOneAndUpdate(
      { slug },
      { $set: { stock } },
      { new: true, runValidators: true },
    );
    if (!doc) {
      return error(res, "Unknown product slug", 404);
    }

    return success(res, { product: doc.toObject() });
  } catch (err) {
    console.error("adminUpdateProductStock:", err);
    return error(res, "Failed to update stock", 500);
  }
}
