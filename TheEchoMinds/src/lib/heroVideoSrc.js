/**
 * Canonical full-bleed ambient background for `HomePageBackground` + `PageBackground`.
 *
 * Default file location (Vite / static hosts like Render):
 *   `public/VIDEO.mp4`  →  browser requests `/VIDEO.mp4`
 *
 * Keep a single copy there — not under `public/videos/`, so every page shares one URL.
 * Override with `VITE_HERO_VIDEO_URL` (HTTPS, e.g. Cloudinary delivery URL).
 */
function heroBackgroundVideoPath() {
  const base = import.meta.env.BASE_URL || "/";
  const normalized = base.endsWith("/") ? base : `${base}/`;
  return `${normalized}VIDEO.mp4`;
}

export const HERO_BACKGROUND_VIDEO_PATH = heroBackgroundVideoPath();

export const HERO_VIDEO_SRC =
  (import.meta.env.VITE_HERO_VIDEO_URL || "").trim() || HERO_BACKGROUND_VIDEO_PATH;
