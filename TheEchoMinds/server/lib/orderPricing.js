/**
 * Authoritative INR base prices (MRP) — keep in sync with `src/lib/cart.js` CART_CATALOG.
 * S.1 surcharges use the same rules as `src/lib/s1Preferences.js` (imported below).
 */
import { s1PreferencesSurchargeInr } from "../../src/lib/s1Preferences.js";

export const CATALOG_BASE_INR = {
  g1: 22595,
  s1: 19750,
};

function normalizeSku(raw) {
  return String(raw ?? "")
    .trim()
    .toLowerCase();
}

/**
 * @param {{ sku?: string, qty?: number, s1Preferences?: object }} line
 * @returns {number | null} line total INR, or null if SKU unknown
 */
export function expectedLineTotalInr(line) {
  const sku = normalizeSku(line?.sku);
  const base = CATALOG_BASE_INR[sku];
  if (base == null) return null;
  const qty = Math.max(1, Math.min(99, Math.floor(Number(line.qty)) || 1));
  let unit = base;
  if (sku === "s1" && line.s1Preferences) {
    unit = base + s1PreferencesSurchargeInr(line.s1Preferences);
  }
  return unit * qty;
}

/**
 * @param {{ lineItems?: unknown[], name?: string, model?: string, sku?: string, s1Preferences?: object }} product
 * @returns {number | null} full order total INR, or null if not derivable
 */
export function expectedOrderTotalInr(product) {
  if (!product || typeof product !== "object") return null;

  const lines = product.lineItems;
  if (Array.isArray(lines) && lines.length > 0) {
    let sum = 0;
    for (const line of lines) {
      const part = expectedLineTotalInr(line);
      if (part == null) return null;
      sum += part;
    }
    return Math.round(sum);
  }

  const singleSku = normalizeSku(product.sku);
  if (singleSku === "g1") return CATALOG_BASE_INR.g1;
  if (singleSku === "s1") {
    const base = CATALOG_BASE_INR.s1;
    if (product.s1Preferences) return Math.round(base + s1PreferencesSurchargeInr(product.s1Preferences));
    return base;
  }

  const blob = `${product.name || ""} ${product.model || ""}`.toLowerCase();
  if (/\bcart order\b/.test(blob)) return null;

  if (/\bs\.?\s*1\b|spectacles/.test(blob) && !/\bg\.?\s*1\b|goggles/.test(blob)) {
    return CATALOG_BASE_INR.s1;
  }
  if (/\bg\.?\s*1\b|goggles/.test(blob)) {
    return CATALOG_BASE_INR.g1;
  }

  return null;
}
