import { memo, useEffect, useRef } from "react";

const RATIO_CLASS = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  video: "aspect-video",
  square: "aspect-square",
};

/**
 * @param {{ item: { type: string, src: string, alt: string, poster?: string, ratio?: string }, mediaActive: boolean, accent?: "cyan" | "violet" }} props
 */
function ProductGalleryCard({ item, mediaActive, accent = "cyan" }) {
  const videoRef = useRef(null);
  const ratioClass = RATIO_CLASS[item.ratio || "landscape"];
  const glow =
    accent === "violet"
      ? "hover:shadow-[0_20px_50px_-12px_rgba(167,139,250,0.14)] hover:ring-violet-400/25"
      : "hover:shadow-[0_20px_50px_-12px_rgba(34,211,238,0.12)] hover:ring-cyan-400/20";

  useEffect(() => {
    const el = videoRef.current;
    if (!el || item.type !== "video") return;

    const tryPlay = () => {
      if (mediaActive) {
        el.play().catch(() => {});
      } else {
        el.pause();
      }
    };

    tryPlay();
    el.addEventListener("canplay", tryPlay);
    el.addEventListener("loadeddata", tryPlay);
    return () => {
      el.removeEventListener("canplay", tryPlay);
      el.removeEventListener("loadeddata", tryPlay);
    };
  }, [mediaActive, item.type, item.src]);

  return (
    <article
      className={`group/card relative overflow-hidden rounded-2xl border border-white/[0.1] bg-zinc-950/90 shadow-[0_10px_36px_rgba(0,0,0,0.5)] ring-1 ring-white/[0.05] backdrop-blur-[2px] transition-all duration-300 ease-out hover:scale-[1.02] hover:border-white/18 ${glow}`}
    >
      <div className={`relative w-full overflow-hidden ${ratioClass}`}>
        {item.type === "video" ? (
          <video
            ref={videoRef}
            src={item.src}
            poster={item.poster}
            className="h-full w-full object-cover [transform:translateZ(0)]"
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            aria-label={item.alt}
          />
        ) : (
          <img
            src={item.src}
            alt={item.alt}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        )}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/15 opacity-80 transition-opacity duration-300 group-hover/card:opacity-100"
          aria-hidden
        />
      </div>
    </article>
  );
}

export default memo(ProductGalleryCard);
