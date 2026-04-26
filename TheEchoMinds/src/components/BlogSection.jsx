import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/** Full-bleed clips for blog strip cards (public/videos). */
const BLOG_CARD_VIDEOS = [
  "/videos/video_2026-04-26_00-56-32.mp4",
  "/videos/video_2026-04-26_00-56-06.mp4",
  "/videos/video_2026-04-26_00-55-59.mp4",
  "/videos/video_2026-04-26_00-51-54.mp4",
];

const posts = [
  {
    title: "On-device AI: what it means for your privacy",
    videoSrc: BLOG_CARD_VIDEOS[0],
  },
  {
    title: "Designing smart glasses for all-day comfort",
    videoSrc: BLOG_CARD_VIDEOS[1],
  },
  {
    title: "The road to natural voice and live translation",
    videoSrc: BLOG_CARD_VIDEOS[2],
  },
  {
    title: "Field testing EchoLens in real cities",
    videoSrc: BLOG_CARD_VIDEOS[3],
  },
];

function useInViewVideoPlay(wrapRef, videoRef) {
  const inViewRef = useRef(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    const sync = () => {
      if (inViewRef.current) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    const io = new IntersectionObserver(
      ([e]) => {
        inViewRef.current = e.isIntersecting;
        sync();
      },
      { threshold: 0.25, rootMargin: "60px 0px" }
    );
    io.observe(wrap);
    video.addEventListener("canplay", sync);
    video.addEventListener("loadeddata", sync);
    sync();

    return () => {
      io.disconnect();
      video.removeEventListener("canplay", sync);
      video.removeEventListener("loadeddata", sync);
    };
  }, []);
}

/** Left column: two matching horizontal-style video tiles (object-contain, slightly larger). */
function BlogStackVideoCard({ title, videoSrc }) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const [isLandscape, setIsLandscape] = useState(false);
  useInViewVideoPlay(wrapRef, videoRef);

  return (
    <div className="flex flex-col">
      <div className="p-[1px] rounded-2xl sm:rounded-3xl bg-gradient-to-b from-white/20 via-white/5 to-white/[0.02]">
        <div className="rounded-2xl sm:rounded-3xl bg-zinc-950/95 p-2 sm:p-2.5 backdrop-blur-sm">
          <div
            ref={wrapRef}
            className="relative flex w-full items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl bg-black shadow-lg ring-1 ring-white/[0.08] h-[min(32vh,200px)] sm:h-[min(34vh,216px)] md:h-[min(36vh,232px)]"
          >
            <video
              ref={videoRef}
              src={videoSrc}
              onLoadedMetadata={(e) => {
                const v = e.target;
                if (v.videoWidth && v.videoHeight) setIsLandscape(v.videoWidth > v.videoHeight);
              }}
              className="max-h-full max-w-full object-contain [transform:translateZ(0)]"
              muted
              loop
              playsInline
              autoPlay
              preload="auto"
              aria-label={title}
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[inherit]"
              aria-hidden
            />
          </div>
        </div>
      </div>
      {isLandscape ? (
        <p className="mt-2 px-1 text-center text-xs leading-snug text-zinc-400 line-clamp-2">{title}</p>
      ) : null}
    </div>
  );
}

/** Top-right: short promo card (lavender). Third clip plays softly behind text so all four assets are used. */
function BlogPromoCard({ headline, subline, bgVideoSrc }) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  useInViewVideoPlay(wrapRef, videoRef);

  return (
    <div className="p-[1px] rounded-2xl sm:rounded-3xl bg-gradient-to-b from-violet-300/35 via-white/10 to-fuchsia-500/20">
      <div
        ref={wrapRef}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-violet-200/95 via-purple-100/90 to-fuchsia-100/85 px-5 py-7 sm:py-8 text-center shadow-lg ring-1 ring-violet-300/40 min-h-[7.5rem] sm:min-h-[8.25rem] flex items-center justify-center"
      >
        <video
          ref={videoRef}
          src={bgVideoSrc}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.22] blur-[1.5px] scale-105 saturate-75"
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
        />
        <div className="relative z-10 max-w-[16rem] mx-auto">
          <p className="text-base sm:text-lg font-semibold tracking-tight text-violet-950 leading-snug">{headline}</p>
          {subline ? (
            <p className="mt-2 text-xs sm:text-sm text-violet-900/75 leading-relaxed line-clamp-2">{subline}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** Bottom-right: tall card with gradient veil, site link, and main video (fourth clip). */
function BlogTallSpotlightCard({ title, videoSrc }) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  useInViewVideoPlay(wrapRef, videoRef);

  return (
    <div className="p-[1px] rounded-2xl sm:rounded-3xl bg-gradient-to-b from-fuchsia-400/25 via-white/8 to-violet-600/25">
      <div className="rounded-2xl sm:rounded-3xl bg-zinc-950/95 p-2 sm:p-2.5 backdrop-blur-sm">
        <div
          ref={wrapRef}
          className="relative flex min-h-[min(52vh,380px)] sm:min-h-[min(54vh,420px)] md:min-h-[440px] flex-col overflow-hidden rounded-xl sm:rounded-2xl bg-black ring-1 ring-white/[0.1]"
        >
          <video
            ref={videoRef}
            src={videoSrc}
            className="absolute inset-0 h-full w-full object-contain [transform:translateZ(0)]"
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            aria-label={title}
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-fuchsia-600/45 via-purple-800/40 to-violet-950/88"
            aria-hidden
          />
          <div className="relative z-10 flex flex-col items-center pt-5 sm:pt-6 px-4">
            <a
              href="https://www.echominds.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm font-medium tracking-wide text-white/90 underline-offset-4 hover:text-white hover:underline"
            >
              www.echominds.com
            </a>
            <div
              className="mt-5 sm:mt-6 flex h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem] items-center justify-center rounded-full bg-white/92 text-violet-800 shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-4 ring-white/25"
              aria-hidden
            >
              <Play className="ml-1 h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2.25} fill="currentColor" />
            </div>
          </div>
          <div className="relative z-10 mt-auto flex flex-1 flex-col justify-end px-4 pb-5 sm:pb-6 pt-8">
            <p className="text-center text-xs sm:text-sm font-medium leading-snug text-white/90 line-clamp-2 drop-shadow-md">
              {title}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BlogSection() {
  const [left0, left1, mid, tall] = posts;

  return (
    <section id="blogs" className="py-20 sm:py-28 scroll-mt-24 w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center sm:text-left mb-8 sm:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-white/50 mb-2">Stories</p>
            <h2 className="text-3xl sm:text-4xl font-medium text-white tracking-tight">From the blog</h2>
          </motion.div>
        </div>

        <motion.div
          className="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 md:items-start"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          role="list"
          aria-label="Blog stories and clips"
        >
          {/* Left column: two equal-width video cards stacked */}
          <div className="flex flex-col gap-5 sm:gap-6" role="presentation">
            <motion.article
              role="listitem"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4 }}
            >
              <BlogStackVideoCard title={left0.title} videoSrc={left0.videoSrc} />
            </motion.article>
            <motion.article
              role="listitem"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <BlogStackVideoCard title={left1.title} videoSrc={left1.videoSrc} />
            </motion.article>
          </div>

          {/* Right column: short promo on top, tall gradient video below (staggered vs left) */}
          <div className="flex flex-col gap-5 sm:gap-6" role="presentation">
            <motion.article
              role="listitem"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: 0.08 }}
            >
              <BlogPromoCard
                headline="Experience a new vision today!"
                subline={mid.title}
                bgVideoSrc={mid.videoSrc}
              />
            </motion.article>
            <motion.article
              role="listitem"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: 0.1 }}
            >
              <BlogTallSpotlightCard title={tall.title} videoSrc={tall.videoSrc} />
            </motion.article>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
