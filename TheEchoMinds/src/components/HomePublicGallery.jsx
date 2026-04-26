import { useEffect, useState } from "react";
import ProductGalleryMasonry from "@/components/product/ProductGalleryMasonry.jsx";
import { HOME_FLOW_GALLERY_ITEMS } from "@/data/productFlowGallery.js";
import { API_BASE } from "@/lib/api";

/**
 * Loads homepage masonry items from `public/gallery` via `GET /api/home-gallery`.
 * Falls back to `HOME_FLOW_GALLERY_ITEMS` if the folder is empty, the API fails, or the backend is off.
 */
export default function HomePublicGallery({
  title = "Gallery",
  subtitle = "",
  sectionId = "home-gallery",
  accent = "cyan",
}) {
  const [items, setItems] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const ac = new AbortController();
      const t = setTimeout(() => ac.abort(), 8000);
      try {
        const res = await fetch(`${API_BASE}/home-gallery`, { signal: ac.signal });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        const list = Array.isArray(data.items) ? data.items : [];
        setItems(list.length > 0 ? list : HOME_FLOW_GALLERY_ITEMS);
      } catch {
        if (!cancelled) setItems(HOME_FLOW_GALLERY_ITEMS);
      } finally {
        clearTimeout(t);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (items === null) {
    return (
      <section
        id={sectionId}
        className="relative scroll-mt-24 py-16 sm:py-24 md:py-28"
        aria-label={title}
      >
        <div className="mx-auto max-w-6xl px-5 text-center text-sm text-zinc-500 sm:px-10">Loading gallery…</div>
      </section>
    );
  }

  return (
    <ProductGalleryMasonry
      sectionId={sectionId}
      title={title}
      subtitle={subtitle}
      items={items}
      accent={accent}
    />
  );
}
