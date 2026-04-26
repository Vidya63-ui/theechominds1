import {
  cloneS1Preferences,
  isS1PreferencesComplete,
  s1PreferencesLensLabel,
  s1PreferencesSurchargeInr,
} from "@/lib/s1Preferences.js";

const CART_KEY = "echominds_cart";

/** Default catalog items users can add from My Profile */
export const CART_CATALOG = [
  { sku: "g1", name: "EchoLens G.1", model: "Goggles", amount: 22595 },
  { sku: "s1", name: "EchoLens S.1", model: "Spectacles", amount: 19750 },
];

/** S.1 lens upgrades (added to base S.1 price when ordering with prescription from the product page) */
export const S1_LENS_SURCHARGES = {
  normal: 0,
  anti_glare: 1000,
  premium_blue_cut: 2000,
};

export const S1_LENS_OPTIONS = [
  {
    id: "normal",
    label: "Standard lens",
    description: "Clear correction — no lens upgrade charge.",
    surcharge: 0,
  },
  {
    id: "anti_glare",
    label: "Anti-glare lens",
    description: "Reduced reflections for screens and night driving.",
    surcharge: 1000,
  },
  {
    id: "premium_blue_cut",
    label: "Premium (anti-glare + blue cut)",
    description: "Anti-glare plus blue-light filtering for extended screen use.",
    surcharge: 2000,
  },
];

export function lensSurchargeInr(tier) {
  return S1_LENS_SURCHARGES[tier] ?? 0;
}

function lensLabelForTier(tier) {
  const opt = S1_LENS_OPTIONS.find((o) => o.id === tier);
  return opt ? opt.label : "Standard lens";
}

/**
 * @returns {{ sku: string, name: string, model: string, amount: number, qty: number }[]}
 */
/** Sync line to current catalog MRP (+ S.1 surcharges when preferences exist). */
export function repriceCartLine(line) {
  const skuKey = String(line?.sku ?? "")
    .trim()
    .toLowerCase();
  const cat = CART_CATALOG.find((c) => c.sku === skuKey);
  if (!cat) return { ...line, sku: skuKey || line.sku };
  if (skuKey === "s1" && line.s1Preferences) {
    const surcharge = s1PreferencesSurchargeInr(line.s1Preferences);
    return { ...line, sku: cat.sku, name: cat.name, model: cat.model, amount: cat.amount + surcharge };
  }
  return { ...line, sku: cat.sku, name: cat.name, model: cat.model, amount: cat.amount };
}

export function repriceCart(lines) {
  if (!Array.isArray(lines)) return [];
  return lines.map(repriceCartLine);
}

export function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const repriced = repriceCart(parsed);
    const changed = repriced.some((l, i) => {
      const o = parsed[i];
      if (!o || o.sku !== l.sku) return true;
      return Number(o.amount) !== Number(l.amount) || o.name !== l.name;
    });
    if (changed) setCart(repriced);
    return repriced;
  } catch {
    return [];
  }
}

export function setCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}

export function cartLineTotal(line) {
  return (line.amount || 0) * (line.qty || 0);
}

export function cartSubtotal(items) {
  return items.reduce((sum, line) => sum + cartLineTotal(line), 0);
}

/**
 * @param {string} sku
 * @param {{ s1Preferences?: import("@/lib/s1Preferences.js").S1Preferences } | undefined} extra — S.1: preference wizard payload (no prescription fields)
 */
export function addOrUpdateLine(sku, extra) {
  const cat = CART_CATALOG.find((c) => c.sku === sku);
  if (!cat) return getCart();
  const cart = getCart();
  const i = cart.findIndex((l) => l.sku === sku);

  if (sku === "s1" && extra && typeof extra === "object" && extra.s1Preferences) {
    const prefs = cloneS1Preferences(extra.s1Preferences);
    if (!isS1PreferencesComplete(prefs)) return getCart();
    const surcharge = s1PreferencesSurchargeInr(prefs);
    const amount = cat.amount + surcharge;
    const line = {
      ...cat,
      amount,
      qty: 1,
      s1Preferences: prefs,
      lensLabel: s1PreferencesLensLabel(prefs),
      lensTier: "preferences",
    };
    if (i >= 0) cart[i] = line;
    else cart.push(line);
    setCart(cart);
    return cart;
  }

  if (i >= 0) {
    cart[i] = { ...cart[i], qty: (cart[i].qty || 1) + 1 };
  } else {
    cart.push({ ...cat, qty: 1 });
  }
  setCart(cart);
  return cart;
}

export function setLineQty(sku, qty) {
  const n = Math.max(0, Math.min(99, Math.floor(Number(qty)) || 0));
  let cart = getCart();
  if (n === 0) {
    cart = cart.filter((l) => l.sku !== sku);
  } else {
    const i = cart.findIndex((l) => l.sku === sku);
    if (i >= 0) cart[i] = { ...cart[i], qty: n };
  }
  setCart(cart);
  return cart;
}

export function removeLine(sku) {
  const cart = getCart().filter((l) => l.sku !== sku);
  setCart(cart);
  return cart;
}
