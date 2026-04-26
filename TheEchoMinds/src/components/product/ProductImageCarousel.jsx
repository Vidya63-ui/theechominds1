import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/** Time between auto-advances (default 2s on product pages). */
const DEFAULT_INTERVAL = 2000;

/**
 * Auto-advancing single-image gallery (one photo fully visible at a time).
 * @param {{ images: { src: string, alt: string }[], intervalMs?: number, className?: string }} props
 */
export default function ProductImageCarousel({
  images,
  intervalMs = DEFAULT_INTERVAL,
  className = "",
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const n = images?.length || 0;

  const next = useCallback(() => {
    if (n < 2) return;
    setIndex((i) => (i + 1) % n);
  }, [n]);

  const prev = useCallback(() => {
    if (n < 2) return;
    setIndex((i) => (i - 1 + n) % n);
  }, [n]);

  useEffect(() => {
    if (n < 2 || paused) return;
    const t = setInterval(next, intervalMs);
    return () => clearInterval(t);
  }, [n, paused, intervalMs, next]);

  if (!n) return null;

  const current = images[index];

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.12)] backdrop-blur-sm ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={current.src + index}
            src={current.src}
            alt={current.alt}
            className="absolute inset-0 h-full w-full object-contain p-4 sm:p-6 md:p-8"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            draggable={false}
          />
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />
      </div>

      {n > 1 && (
        <>
          <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-8 bg-white shadow-sm" : "w-1.5 bg-white/35 hover:bg-white/50"
                }`}
                aria-label={`Show image ${i + 1} of ${n}`}
              />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-2 right-2 z-10 flex items-center justify-between">
            <button
              type="button"
              onClick={prev}
              className="pointer-events-auto h-10 w-10 rounded-full border border-white/15 bg-black/25 text-lg leading-none text-white backdrop-blur-sm transition-colors hover:bg-black/40 hover:border-white/25"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              className="pointer-events-auto h-10 w-10 rounded-full border border-white/15 bg-black/25 text-lg leading-none text-white backdrop-blur-sm transition-colors hover:bg-black/40 hover:border-white/25"
              aria-label="Next image"
            >
              ›
            </button>
          </div>
        </>
      )}
    </div>
  );
}
