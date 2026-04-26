import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useLayoutEffect, useRef } from "react";
import { HERO_VIDEO_SRC } from "@/lib/heroVideoSrc.js";

const SCROLL_RAMP_PX = 1000;
const VIEWPORT_SHIFT = 0.42;

/**
 * Home-only: past Core features, video blur + dark gradients intensify with scroll depth.
 */
export default function HomePageBackground() {
  const { scrollY } = useScroll();
  const startScrollY = useRef(0);

  const recompute = () => {
    const el = document.getElementById("features");
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const absoluteTop = rect.top + window.scrollY;
    startScrollY.current = Math.max(0, absoluteTop - window.innerHeight * VIEWPORT_SHIFT);
  };

  useLayoutEffect(() => {
    recompute();
    window.addEventListener("resize", recompute);
    window.addEventListener("load", recompute);
    const t = setTimeout(recompute, 200);
    return () => {
      window.removeEventListener("resize", recompute);
      window.removeEventListener("load", recompute);
      clearTimeout(t);
    };
  }, []);

  const progress = useTransform(scrollY, (y) => {
    const start = startScrollY.current;
    if (start <= 0) return 0;
    return Math.min(1, Math.max(0, (y - start) / SCROLL_RAMP_PX));
  });

  const progressSmooth = useSpring(progress, { stiffness: 80, damping: 28, mass: 0.4 });

  const videoBlur = useTransform(progressSmooth, (p) => `blur(${4 + p * 22}px)`);
  const videoOpacity = useTransform(progressSmooth, [0, 1], [0.7, 0.35]);
  const extraGradient = useTransform(progressSmooth, [0, 1], [0, 0.88]);
  const bottomFalloff = useTransform(progressSmooth, [0, 1], [0, 0.75]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <motion.video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-cover scale-110 will-change-[filter,opacity]"
        style={{ filter: videoBlur, opacity: videoOpacity }}
      >
        <source src={HERO_VIDEO_SRC} type="video/mp4" />
      </motion.video>

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_40%)]" />
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black pointer-events-none"
        style={{ opacity: extraGradient }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none bg-gradient-to-b from-zinc-950/0 from-0% via-black/30 via-50% to-black to-100%"
        style={{ opacity: bottomFalloff }}
      />
    </div>
  );
}
