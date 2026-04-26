import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const VIDEO_EXT = new Set([".mp4", ".webm", ".mov", ".m4v"]);
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".bmp"]);

const RATIO_CYCLE = ["portrait", "landscape", "square"];
const DEFAULT_VIDEO_POSTER = "/videos/echolens-bg-poster.jpg";

/**
 * Build gallery items from `public/gallery` (sorted filenames).
 * URLs use encodeURIComponent for spaces/special chars.
 */
export function listPublicHomeGalleryItems() {
  const dir = path.join(__dirname, "..", "public", "gallery");
  if (!fs.existsSync(dir)) return [];

  const names = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile() && !d.name.startsWith("."))
    .map((d) => d.name)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

  const items = [];
  let imageIdx = 0;

  for (const name of names) {
    const ext = path.extname(name).toLowerCase();
    if (VIDEO_EXT.has(ext)) {
      items.push({
        type: "video",
        src: `/gallery/${encodeURIComponent(name)}`,
        poster: DEFAULT_VIDEO_POSTER,
        alt: `Gallery video — ${name.replace(/\.[^.]+$/, "")}`,
        ratio: "video",
      });
    } else if (IMAGE_EXT.has(ext)) {
      items.push({
        type: "image",
        src: `/gallery/${encodeURIComponent(name)}`,
        alt: `Gallery — ${name.replace(/\.[^.]+$/, "")}`,
        ratio: RATIO_CYCLE[imageIdx % RATIO_CYCLE.length],
      });
      imageIdx += 1;
    }
  }

  return items;
}
