import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import ProductGalleryColumn from "./ProductGalleryColumn.jsx";
import { splitGalleryItemsIntoColumns } from "@/data/productFlowGallery.js";

const DURATION_PATTERN = [50, 38, 44, 58, 41, 53];

/** Charcoal surface (same family as page overlays — not #000). */
const SURFACE_TOP = "rgba(58, 58, 58, 0.97)";
const SURFACE_MID = "rgba(43, 43, 43, 0.9)";
const SURFACE_SOFT = "rgba(43, 43, 43, 0.42)";
const SURFACE_FAINT = "rgba(58, 58, 58, 0.14)";

function useGalleryColumnCount() {
  const [count, setCount] = useState(2);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1024) setCount(4);
      else if (w >= 768) setCount(3);
      else setCount(2);
    };
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
}

/**
 * Immersive infinite-scroll masonry columns (config-driven media).
 *
 * @param {{
 *   title?: string,
 *   subtitle?: string,
 *   items: { type: string, src: string, alt: string, poster?: string, ratio?: string }[],
 *   accent?: "cyan" | "violet",
 *   sectionId?: string
 * }} props
 */
export default function ProductGalleryMasonry({
  title = "Gallery",
  subtitle = "",
  items,
  accent = "cyan",
  sectionId,
}) {
  const sectionRef = useRef(null);
  const [mediaActive, setMediaActive] = useState(true);
  const columnCount = useGalleryColumnCount();

  const effectiveCols = Math.min(columnCount, Math.max(1, items.length));

  const columns = useMemo(
    () => splitGalleryItemsIntoColumns(items, effectiveCols),
    [items, effectiveCols]
  );

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setMediaActive(e.isIntersecting);
      },
      { threshold: 0.06, rootMargin: "40px 0px" }
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  const kickerClass =
    accent === "violet"
      ? "text-violet-300/90"
      : "text-cyan-400/90";

  if (!items.length) return null;

  return (
    <section
      id={sectionId}
      ref={sectionRef}
      className={`relative overflow-hidden bg-transparent py-16 sm:py-24 md:py-28${sectionId ? " scroll-mt-24" : ""}`}
      aria-label={title}
    >
      <div className="relative z-[40] max-w-6xl mx-auto px-5 sm:px-10 md:px-14 mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45 }}
        >
          <p className={`text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] ${kickerClass}`}>Immersive</p>
          <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-semibold text-white tracking-tight">{title}</h2>
          {subtitle?.trim() ? (
            <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">{subtitle}</p>
          ) : null}
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 sm:px-10 md:px-14 lg:px-20">
        <div className="relative isolate">
          <div className="product-gallery-masked-grid relative z-0">
            <div
              className="grid gap-3 sm:gap-4 md:gap-5"
              style={{ gridTemplateColumns: `repeat(${effectiveCols}, minmax(0, 1fr))` }}
            >
              {columns.map((colItems, i) => (
                <ProductGalleryColumn
                  key={`col-${effectiveCols}-${i}`}
                  items={colItems}
                  durationSec={DURATION_PATTERN[i % DURATION_PATTERN.length]}
                  mediaActive={mediaActive}
                  accent={accent}
                />
              ))}
            </div>
          </div>

          {/*
            Progressive top blur (reference: heavy blur at top → sharp mid-gallery).
            Stacked backdrop-blur + masks; charcoal veils (not #000). Third band md+ only for perf.
          */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-[22] h-[min(58vh,560px)] max-h-[640px]"
            aria-hidden
          >
            <div
              className="absolute inset-x-0 top-0 h-[34%] max-h-[260px] sm:max-h-[300px] backdrop-blur-[22px] sm:backdrop-blur-[28px] bg-gradient-to-b from-[#141416]/88 via-[#1f1f22]/45 to-transparent [mask-image:linear-gradient(to_bottom,black_0%,black_22%,transparent_92%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_22%,transparent_92%)]"
            />
            <div
              className="absolute inset-x-0 top-0 h-[50%] max-h-[340px] sm:max-h-[380px] backdrop-blur-md bg-gradient-to-b from-transparent via-[#2b2b2b]/28 to-transparent [mask-image:linear-gradient(to_bottom,transparent_0%,black_18%,black_48%,transparent_90%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_18%,black_48%,transparent_90%)]"
            />
            <div className="absolute inset-x-0 top-0 hidden h-[64%] max-h-[440px] backdrop-blur-sm bg-gradient-to-b from-transparent via-[#3a3a3a]/12 to-transparent [mask-image:linear-gradient(to_bottom,transparent_25%,black_38%,transparent_92%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_25%,black_38%,transparent_92%)] md:block" />
          </div>

          {/* Top surface merge — sits above blur stack for seamless edge into page */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-[26] w-full h-[clamp(100px,22vw,180px)] sm:h-[clamp(150px,20vw,240px)] md:h-[clamp(200px,18vw,280px)]"
            style={{
              background: `linear-gradient(to bottom, ${SURFACE_TOP} 0%, ${SURFACE_MID} 12%, ${SURFACE_SOFT} 32%, ${SURFACE_FAINT} 52%, rgba(43,43,43,0) 100%)`,
            }}
            aria-hidden
          />

          {/* Bottom falloff */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[20] h-14 sm:h-20 md:h-28"
            style={{
              background: `linear-gradient(to top, ${SURFACE_MID} 0%, rgba(43,43,43,0.55) 40%, rgba(58,58,58,0.12) 72%, rgba(43,43,43,0) 100%)`,
            }}
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}
