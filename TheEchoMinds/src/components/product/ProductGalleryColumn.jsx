import { useEffect, useState } from "react";
import ProductGalleryCard from "./ProductGalleryCard.jsx";

/**
 * @param {{
 *   items: { type: string, src: string, alt: string, poster?: string, ratio?: string }[],
 *   durationSec: number,
 *   mediaActive: boolean,
 *   accent?: "cyan" | "violet"
 * }} props
 */
export default function ProductGalleryColumn({ items, durationSec, mediaActive, accent = "cyan" }) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const loop = items.length === 0 ? [] : reduceMotion ? items : [...items, ...items];

  return (
    <div
      className={`product-gallery-column relative ${reduceMotion ? "h-auto min-h-0" : "h-[min(84vh,920px)] min-h-[440px] sm:min-h-[540px] md:min-h-[620px] lg:min-h-[680px]"}`}
    >
      <div
        className={`flex flex-col gap-4 sm:gap-5 ${reduceMotion ? "" : "product-gallery-track"}`}
        style={reduceMotion ? undefined : { "--pg-duration": `${durationSec}s` }}
      >
        {loop.map((item, idx) => (
          <ProductGalleryCard
            key={`${item.src}-${item.type}-${idx}`}
            item={item}
            mediaActive={mediaActive}
            accent={accent}
          />
        ))}
      </div>
    </div>
  );
}
