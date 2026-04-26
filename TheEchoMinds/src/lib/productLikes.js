const KEY = "echominds_product_likes_v1";

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return /** @type {Record<string, boolean>} */ ({});
    const p = JSON.parse(raw);
    return p && typeof p === "object" ? p : {};
  } catch {
    return {};
  }
}

function write(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

/** @param {string} productKey e.g. product-1 */
export function isProductLiked(productKey) {
  return Boolean(read()[productKey]);
}

/** @param {string} productKey */
export function toggleProductLike(productKey) {
  const all = read();
  all[productKey] = !all[productKey];
  write(all);
  return all[productKey];
}
