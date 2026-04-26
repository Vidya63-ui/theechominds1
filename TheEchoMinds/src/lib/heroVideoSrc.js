/**
 * Full-bleed hero background clip. Set VITE_HERO_VIDEO_URL to the HTTPS delivery URL
 * from Cloudinary (Media Library → video → copy link). CLOUDINARY_URL is only for API uploads.
 */
export const HERO_VIDEO_SRC =
  (import.meta.env.VITE_HERO_VIDEO_URL || "").trim() || "/VIDEO.mp4";
