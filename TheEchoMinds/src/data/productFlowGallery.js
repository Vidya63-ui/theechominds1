/**
 * Flow-style masonry gallery: replace `src` / `poster` paths when your assets are ready.
 *
 * @typedef {'image'|'video'} ProductGalleryMediaType
 * @typedef {'portrait'|'landscape'|'video'|'square'} ProductGalleryAspect
 * @typedef {{ type: ProductGalleryMediaType, src: string, alt: string, poster?: string, ratio?: ProductGalleryAspect }} ProductGalleryMediaItem
 */

/** @type {ProductGalleryMediaItem[]} */
export const G1_FLOW_GALLERY_ITEMS = [
  { type: "image", src: "/smartglass/NLB08-sunglasses (1).png", alt: "EchoLens G.1 — hero", ratio: "portrait" },
  { type: "video", src: "/videos/echolens-product-demo.mp4", poster: "/videos/echolens-bg-poster.jpg", alt: "Product overview clip", ratio: "video" },
  { type: "image", src: "/smartglass/NLB08-sunglasses(2).png", alt: "EchoLens G.1 — profile", ratio: "square" },
  { type: "image", src: "/smartglass/NLB08-sunglasses (3).png", alt: "EchoLens G.1 — detail", ratio: "portrait" },
  { type: "video", src: "/videos/24541-343454486_medium.mp4", poster: "/videos/echolens-bg-poster.jpg", alt: "Ambient lifestyle loop", ratio: "landscape" },
  { type: "image", src: "/smartglass/NLB08-sunglasses (4).png", alt: "EchoLens G.1 — lenses", ratio: "landscape" },
  { type: "image", src: "/smartglass/NLB08-sunglasses(5).png", alt: "EchoLens G.1 — full frame", ratio: "portrait" },
  { type: "image", src: "/smartglass/NLB08-sunglasses (6).png", alt: "EchoLens G.1 — alternate", ratio: "square" },
  { type: "image", src: "/images/shutterstock_731158624.jpg", alt: "Recognition context", ratio: "landscape" },
  { type: "video", src: "/videos/4753-179739298_medium.mp4", poster: "/videos/echolens-bg-poster.jpg", alt: "Brand atmosphere loop", ratio: "video" },
];

/** @type {ProductGalleryMediaItem[]} */
const S1_NTY16 = "/gallery/renderings%20of%20NTY16";
export const S1_FLOW_GALLERY_ITEMS = [
  { type: "image", src: `${S1_NTY16}/(5).png`, alt: "EchoLens S.1 — rendering", ratio: "portrait" },
  { type: "image", src: `${S1_NTY16}/(6).png`, alt: "EchoLens S.1 — rendering", ratio: "square" },
  { type: "video", src: "/videos/echolens-product-demo.mp4", poster: "/videos/echolens-bg-poster.jpg", alt: "Product overview clip", ratio: "video" },
  { type: "image", src: `${S1_NTY16}/(7).png`, alt: "EchoLens S.1 — rendering", ratio: "portrait" },
  { type: "image", src: "/images/live translation.jpg", alt: "Live translation", ratio: "landscape" },
  { type: "video", src: "/videos/24541-343454486_medium.mp4", poster: "/videos/echolens-bg-poster.jpg", alt: "Lifestyle loop", ratio: "landscape" },
  { type: "image", src: `${S1_NTY16}/(8).png`, alt: "EchoLens S.1 — rendering", ratio: "square" },
  { type: "image", src: "/images/waterproof2.webp", alt: "Durability", ratio: "portrait" },
  { type: "image", src: `${S1_NTY16}/(9).png`, alt: "EchoLens S.1 — rendering", ratio: "landscape" },
  { type: "image", src: `${S1_NTY16}/(10).png`, alt: "EchoLens S.1 — rendering", ratio: "square" },
  { type: "video", src: "/videos/4753-179739298_medium.mp4", poster: "/videos/echolens-bg-poster.jpg", alt: "Atmosphere loop", ratio: "video" },
];

/**
 * Recently added media — listed first so each column shows them at the top of the scroll.
 * (Filenames under public/images and public/videos from 2026-04-26 batch.)
 */
const HOME_RECENT_GALLERY_HEAD = [
  { type: "image", src: "/images/photo_2026-04-26_00-51-27.jpg", alt: "EchoLens — gallery photo", ratio: "portrait" },
  { type: "image", src: "/images/photo_2026-04-26_00-51-32.jpg", alt: "EchoLens — gallery photo", ratio: "portrait" },
  { type: "image", src: "/images/photo_2026-04-26_00-51-37.jpg", alt: "EchoLens — gallery photo", ratio: "portrait" },
  { type: "image", src: "/images/photo_2026-04-26_00-51-43.jpg", alt: "EchoLens — gallery photo", ratio: "landscape" },
  { type: "image", src: "/images/photo_2026-04-26_00-51-49.jpg", alt: "EchoLens — gallery photo", ratio: "landscape" },
  {
    type: "video",
    src: "/videos/video_2026-04-26_00-51-54.mp4",
    poster: "/images/photo_2026-04-26_00-51-27.jpg",
    alt: "EchoLens — gallery clip",
    ratio: "video",
  },
  {
    type: "video",
    src: "/videos/video_2026-04-26_00-55-59.mp4",
    poster: "/images/photo_2026-04-26_00-51-32.jpg",
    alt: "EchoLens — gallery clip",
    ratio: "video",
  },
  {
    type: "video",
    src: "/videos/video_2026-04-26_00-56-06.mp4",
    poster: "/images/photo_2026-04-26_00-51-37.jpg",
    alt: "EchoLens — gallery clip",
    ratio: "video",
  },
  {
    type: "video",
    src: "/videos/video_2026-04-26_00-56-32.mp4",
    poster: "/images/photo_2026-04-26_00-51-43.jpg",
    alt: "EchoLens — gallery clip",
    ratio: "video",
  },
];

/** Homepage gallery (below product section). Recent uploads first, then catalog. */
export const HOME_FLOW_GALLERY_ITEMS = [...HOME_RECENT_GALLERY_HEAD, ...G1_FLOW_GALLERY_ITEMS];

/**
 * @param {ProductGalleryMediaItem[]} items
 * @param {number} columnCount
 * @returns {ProductGalleryMediaItem[][]}
 */
export function splitGalleryItemsIntoColumns(items, columnCount) {
  if (!items.length) return [];
  const n = Math.max(1, Math.min(columnCount, items.length, 6));
  const cols = Array.from({ length: n }, () => /** @type {ProductGalleryMediaItem[]} */ ([]));
  items.forEach((item, i) => {
    cols[i % n].push(item);
  });
  return cols;
}
