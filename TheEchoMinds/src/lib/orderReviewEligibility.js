/**
 * Check whether a stored order’s product data matches a marketing product page id.
 * @param {Record<string, unknown> | null | undefined} product
 * @param {string} productId
 */
export function orderProductMatchesPage(product, productId) {
  if (!product || typeof product !== "object") return false;
  const blob = JSON.stringify(product).toLowerCase();
  if (productId === "product-1") {
    return (
      blob.includes("g.1") ||
      blob.includes("goggle") ||
      blob.includes("lens g1") ||
      (blob.includes("g1") && blob.includes("echolens"))
    );
  }
  if (productId === "product-2") {
    return (
      blob.includes("s.1") ||
      blob.includes("spectacle") ||
      (blob.includes("s1") && blob.includes("echolens"))
    );
  }
  return false;
}

/**
 * @param {{ status?: string, product?: unknown }[]} orders
 * @param {string} productId
 */
export function hasDeliveredOrderForProduct(orders, productId) {
  if (!Array.isArray(orders)) return false;
  return orders.some(
    (o) => o && o.status === "delivered" && orderProductMatchesPage(o.product, productId)
  );
}
