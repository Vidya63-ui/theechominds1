/**
 * EchoLens glasses demo — HTTPS URL only. The host must return 200 for anonymous GET
 * (private S3 objects return 403 and the video will not play).
 * Set VITE_GLASSES_VIDEO_URL in .env to override the default below.
 */
const DEFAULT_GLASSES_VIDEO =
  "https://jizz-morty.s3.eu-north-1.amazonaws.com/glasses.mp4";

export const GLASSES_DEMO_VIDEO_SRC =
  (import.meta.env.VITE_GLASSES_VIDEO_URL || "").trim() || DEFAULT_GLASSES_VIDEO;