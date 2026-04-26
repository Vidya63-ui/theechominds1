const STORAGE_KEY = "echominds_product_reviews_v1";

/**
 * @typedef {{ id: string, name: string, rating: number, text: string, createdAt: string, demo?: boolean }} ProductReview
 */

/** In-product demo reviews (read-only; merged with user-submitted reviews for display). */
export const DEMO_REVIEWS = {
  "product-1": [
    {
      id: "demo-p1-1",
      name: "Aditya M.",
      rating: 5,
      text: "Tried the G.1 for a week—audio is clear and the frame feels light even after long calls. Setup took under ten minutes. Worth it for the price point.",
      createdAt: "2025-12-18T10:00:00.000Z",
      demo: true,
    },
    {
      id: "demo-p1-2",
      name: "Kavya S.",
      rating: 4,
      text: "Camera quality surprised me in daylight. Translation in noisy cafes is hit or miss, but for walking around it’s been solid. Battery got me through a workday with breaks.",
      createdAt: "2025-12-01T14:30:00.000Z",
      demo: true,
    },
    {
      id: "demo-p1-3",
      name: "Rohan K.",
      rating: 5,
      text: "Bought for commute—IP rating gives peace of mind in drizzle. The companion flow could be simpler, but hardware feels premium. Happy early adopter here.",
      createdAt: "2025-11-20T09:15:00.000Z",
      demo: true,
    },
  ],
  "product-2": [
    {
      id: "demo-p2-1",
      name: "Neha P.",
      rating: 4,
      text: "S.1 fits my prescription use case. Comfortable for 8+ hours—no hot spots. AI features are a nice add; waiting for the app update everyone’s talking about.",
      createdAt: "2025-12-10T11:00:00.000Z",
      demo: true,
    },
    {
      id: "demo-p2-2",
      name: "Vikram T.",
      rating: 5,
      text: "Pre-ordered and no regrets. Build is subtle—doesn’t scream “smart” which I wanted. Audio leaks a bit at high volume, nothing a volume step down doesn’t fix.",
      createdAt: "2025-11-28T16:45:00.000Z",
      demo: true,
    },
    {
      id: "demo-p2-3",
      name: "Meera J.",
      rating: 4,
      text: "Great for city use. Live translate helped on a short trip. Would love a darker lens option—hope that’s on the roadmap.",
      createdAt: "2025-11-12T13:20:00.000Z",
      demo: true,
    },
  ],
};

function sortByDateDesc(a, b) {
  return b.createdAt.localeCompare(a.createdAt);
}

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return /** @type {Record<string, ProductReview[]>} */ ({});
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * @param {string} productId
 * @returns {ProductReview[]}
 */
export function getProductReviews(productId) {
  const all = readAll();
  const list = all[productId];
  return Array.isArray(list) ? list.slice().sort(sortByDateDesc) : [];
}

/**
 * Demo + user reviews for the product page, newest first. User entries override same id in storage.
 * @param {string} productId
 * @returns {ProductReview[]}
 */
export function getDisplayReviews(productId) {
  const demos = DEMO_REVIEWS[productId] || [];
  const stored = getProductReviews(productId);
  const byId = new Map();
  for (const d of demos) {
    byId.set(d.id, d);
  }
  for (const s of stored) {
    byId.set(s.id, s);
  }
  return [...byId.values()].sort(sortByDateDesc);
}

/**
 * @param {string} productId
 * @param {{ name: string, rating: number, text: string }} input
 * @returns {ProductReview}
 */
export function addProductReview(productId, { name, rating, text }) {
  const all = readAll();
  const review = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    name: name.trim() || "Anonymous",
    rating: Math.min(5, Math.max(1, Math.round(rating))),
    text: text.trim().slice(0, 2000),
    createdAt: new Date().toISOString(),
  };
  const list = Array.isArray(all[productId]) ? all[productId] : [];
  all[productId] = [review, ...list];
  writeAll(all);
  return review;
}
