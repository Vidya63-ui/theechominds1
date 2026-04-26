import { Card, CardContent } from "@/components/ui/card";
import { GLASSES_DEMO_VIDEO_SRC } from "@/lib/glassesVideoSrc.js";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Battery, Brain, Globe2, Mic2, Shield, Smartphone, Sparkles } from "lucide-react";

/** Short label for glass pill (maps to icon) */
const features = [
  {
    pill: "Intelligence",
    title: "AI Vision",
    desc: "On-device AI spots objects, text, and scenes in real time—fast context when you look, without leaning on the cloud for every frame.",
    image: "/images/original-e1b947cb36707ae1cec1023eddafec04.gif",
    accentVia: "from-violet-500/20 via-fuchsia-500/5",
    revealOverlay: true,
  },
  {
    pill: "Global",
    title: "Live Translation",
    desc: "Subtitles and live interpretation in your line of sight—clearer conversations when you travel, meet, or switch languages on the go.",
    image: "/images/66d66741f0c8f60276394a98_qc_yodao_animationheader.gif",
    accentVia: "from-cyan-500/20 via-blue-500/5",
    revealOverlay: true,
  },
  {
    pill: "Hands-free",
    title: "Voice Assistant",
    desc: "Natural voice control for music, calls, and queries—stay heads-up while EchoLens handles the busywork.",
    image: "/images/7b736a33be802fc2e737e3df56b4ef0e.gif",
    accentVia: "from-amber-500/18 via-orange-500/5",
    revealOverlay: true,
  },
  {
    pill: "Companion",
    title: "EchoApp",
    desc: "One app for settings, media, and device health—pair once, then stay in sync and react quickly as you use your glasses.",
    image: "/images/original-374498f46268f9cf68abd8ef8d479551.gif",
    accentVia: "from-sky-500/20 via-indigo-500/8",
    revealOverlay: true,
    echoSlidePair: {
      first: "/images/original-374498f46268f9cf68abd8ef8d479551.gif",
      second: "/images/original-2ae830cca6a11d926a207ff5a54d3f45.gif",
      firstHoldMs: 7000,
    },
  },
  {
    pill: "All-day",
    title: "All Day Battery",
    desc: "Efficient power for real routines—music, calls, and smart features tuned so you are not tied to a charger all day.",
    image: "/images/lightning-battery-bg.gif",
    accentVia: "from-emerald-500/20 via-teal-500/5",
    revealOverlay: true,
  },
  {
    pill: "Privacy",
    title: "Privacy First",
    desc: "Sensitive processing stays on-device where it matters—fewer surprises, more control over what leaves your glasses.",
    image: "/images/padlock2.gif",
    accentVia: "from-slate-400/15 via-zinc-500/5",
    revealOverlay: true,
    /** Remount GIF on this interval so a finite animation repeats. Remove if your GIF already loops forever. */
    gifRemountIntervalMs: 4000,
  },
];

function iconForPill(pill) {
  const p = (pill || "").toLowerCase();
  if (p.includes("intelligence")) return Brain;
  if (p.includes("global")) return Globe2;
  if (p.includes("hands")) return Mic2;
  if (p.includes("companion") || p.includes("app")) return Smartphone;
  if (p.includes("all-day") || p.includes("battery")) return Battery;
  if (p.includes("privacy")) return Shield;
  return Sparkles;
}

/** Remounts the GIF on an interval so a finite-loop file repeats (no `loop` on `<img>`). */
function RepeatingFeatureGif({ src, alt, className, remountMs }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), remountMs);
    return () => clearInterval(id);
  }, [src, remountMs]);
  return (
    <img
      key={tick}
      src={src}
      alt={alt}
      className={className}
      loading="eager"
      decoding="async"
      draggable={false}
    />
  );
}

/** EchoApp: first GIF fills the frame; after `firstHoldMs` while in view, second GIF slides in from the right. Resets off-screen. */
function EchoAppDualGifMedia({ first, second, firstHoldMs, label }) {
  const wrapRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [showSecond, setShowSecond] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.35, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) {
      setShowSecond(false);
      return;
    }
    const t = setTimeout(() => setShowSecond(true), firstHoldMs);
    return () => clearTimeout(t);
  }, [inView, firstHoldMs]);

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden" role="img" aria-label={label}>
      <img
        src={first}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center transition-transform duration-300 ease-out motion-reduce:transition-none group-hover/reveal:scale-105"
        loading="lazy"
        draggable={false}
      />
      <AnimatePresence>
        {showSecond && (
          <motion.img
            key={second}
            src={second}
            alt=""
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover object-center shadow-[-12px_0_32px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-out motion-reduce:transition-none group-hover/reveal:scale-105"
            loading="lazy"
            draggable={false}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/** Full-width clip below Core features — no CSS transform marquee, so playback stays smooth. */
function CoreFeaturesVideo() {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const inViewRef = useRef(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    setVideoFailed(false);
  }, [GLASSES_DEMO_VIDEO_SRC]);

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
      { threshold: 0.2, rootMargin: "80px 0px" }
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
  }, [GLASSES_DEMO_VIDEO_SRC]);

  return (
    <motion.div
      ref={wrapRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55 }}
      className="mt-16 sm:mt-20 md:mt-24"
    >
      <div className="text-center mb-6 sm:mb-8">
        <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">See it on</h3>
      </div>
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl sm:rounded-3xl border border-white/[0.1] bg-zinc-950 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.65)] ring-1 ring-white/[0.06]">
        <div className="relative aspect-video w-full">
          <video
            key={GLASSES_DEMO_VIDEO_SRC}
            ref={videoRef}
            src={GLASSES_DEMO_VIDEO_SRC}
            className="absolute inset-0 h-full w-full object-cover [transform:translateZ(0)]"
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            aria-label="EchoLens glasses product video"
            onError={() => setVideoFailed(true)}
            onLoadedData={() => setVideoFailed(false)}
          />
          {videoFailed ? (
            <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center gap-3 bg-zinc-950/96 px-5 py-8 text-center sm:px-10">
              <p className="max-w-lg text-sm leading-relaxed text-zinc-300 sm:text-base">
                This clip did not load. The URL must allow anonymous access in the browser (S3 often
                returns 403 until you add a public read policy or use CloudFront).
              </p>
              <p className="max-w-lg text-xs leading-relaxed text-zinc-500 sm:text-sm">
                Add a public HTTPS URL in{" "}
                <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-200">
                  VITE_GLASSES_VIDEO_URL
                </code>{" "}
                in <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-200">.env</code>,
                then restart <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-200">npm run dev</code>.
              </p>
            </div>
          ) : null}
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/25 via-transparent to-black/10"
            aria-hidden
          />
        </div>
      </div>
    </motion.div>
  );
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 18 },
  },
};

export default function FeatureShowcase() {
  const [active, setActive] = useState(0);

  return (
    <section
      id="features"
      className="relative py-24 sm:py-28 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-24"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, black 20%, transparent 75%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 sm:mb-16"
      >
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">Core features</h2>
        <p className="mt-3 text-[#A3ADC2] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Built for real life — tap a card to focus, or explore each capability below.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 auto-rows-[1fr]"
      >
        {features.map((f, i) => {
          const isActive = active === i;
          const Icon = iconForPill(f.pill);
          return (
            <motion.div key={f.title} variants={item} onClick={() => setActive(i)} className="min-h-0">
              <motion.div
                whileHover={{ y: -8, transition: { type: "spring", stiffness: 320, damping: 22 } }}
                whileTap={{ scale: 0.99 }}
                className="h-full cursor-pointer"
              >
                <Card
                  className={`
                    group relative h-full overflow-hidden rounded-3xl border p-0
                    bg-[#1a2436] transition-all duration-300 ease-out
                    [&_img]:brightness-[1.12] [&_img]:contrast-[1.04]
                    ${
                      isActive
                        ? "border-cyan-400/55 shadow-[0_28px_80px_-12px_rgba(34,211,238,0.26)] ring-1 ring-cyan-400/28"
                        : "border-white/[0.14] hover:border-cyan-400/45 hover:shadow-[0_24px_60px_-14px_rgba(34,211,238,0.18)]"
                    }
                  `}
                >
                  {f.revealOverlay ? (
                    <>
                      <div
                        role="region"
                        aria-label={`${f.title} — tap or hover to read details`}
                        tabIndex={0}
                        onPointerDown={(e) => e.currentTarget.focus({ preventScroll: true })}
                        className="group/reveal relative flex min-h-[26rem] w-full flex-col overflow-hidden bg-zinc-900 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-400/45 sm:min-h-[28rem]"
                      >
                        {f.echoSlidePair ? (
                          <EchoAppDualGifMedia
                            first={f.echoSlidePair.first}
                            second={f.echoSlidePair.second}
                            firstHoldMs={f.echoSlidePair.firstHoldMs ?? 7000}
                            label={f.title}
                          />
                        ) : f.gifRemountIntervalMs != null ? (
                          <RepeatingFeatureGif
                            src={f.image}
                            alt={f.title}
                            remountMs={f.gifRemountIntervalMs}
                            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center transition-transform duration-300 ease-out motion-reduce:transition-none group-hover/reveal:scale-105"
                          />
                        ) : (
                          <img
                            src={f.image}
                            alt={f.title}
                            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center transition-transform duration-300 ease-out motion-reduce:transition-none group-hover/reveal:scale-105"
                            loading="lazy"
                          />
                        )}
                        <div
                          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/35 to-black/15"
                          aria-hidden
                        />
                        <div
                          className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/35 to-transparent"
                          aria-hidden
                        />

                        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between px-6 pb-6 pt-4 opacity-0 transition-opacity duration-300 ease-out group-hover/reveal:pointer-events-auto group-hover/reveal:opacity-100 group-focus-within/reveal:pointer-events-auto group-focus-within/reveal:opacity-100 motion-reduce:transition-none sm:px-7 sm:pb-7 sm:pt-5">
                          <div className="shrink-0">
                            <div className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-white/22 bg-black/32 px-2.5 py-1.5 backdrop-blur-md">
                              <Icon className="h-3.5 w-3.5 shrink-0 text-cyan-200/95" strokeWidth={2} aria-hidden />
                              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/95">
                                {f.pill}
                              </span>
                            </div>
                          </div>

                          <div className="relative flex flex-col pt-12 sm:pt-16">
                            <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">{f.title}</h3>
                            <p className="mt-3 line-clamp-4 text-sm leading-[1.65] text-white/90">{f.desc}</p>
                            <div className="mt-5 flex items-center justify-between gap-2">
                              <span
                                className={`text-xs font-semibold tracking-wide transition-colors ${
                                  isActive ? "text-cyan-200" : "text-cyan-300/90 group-hover/reveal:text-cyan-200"
                                }`}
                              >
                                Explore feature <span aria-hidden>→</span>
                              </span>
                            </div>
                            <div
                              className={
                                isActive
                                  ? "mt-6 h-px w-full bg-gradient-to-r from-transparent via-cyan-400/55 to-transparent opacity-100 transition-all duration-300"
                                  : "mt-6 h-px w-full bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent opacity-70 transition-all duration-300 group-hover/reveal:via-cyan-400/50 group-hover/reveal:opacity-100"
                              }
                              aria-hidden
                            />
                          </div>
                        </div>
                      </div>
                      {isActive && (
                        <motion.div
                          layoutId="featureCardGlow"
                          className="pointer-events-none absolute inset-0 z-[5] rounded-3xl ring-1 ring-inset ring-cyan-400/15"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </>
                  ) : (
                    <>
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900">
                        <img
                          src={f.image}
                          alt={f.title}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                          loading="lazy"
                        />
                        <div
                          className={`pointer-events-none absolute inset-0 bg-gradient-to-t ${f.accentVia} to-transparent opacity-75`}
                          aria-hidden
                        />
                        <div
                          className="pointer-events-none absolute inset-x-0 bottom-0 h-[36%] bg-gradient-to-t from-black/68 via-black/32 to-transparent"
                          aria-hidden
                        />
                        <div
                          className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/25 to-transparent"
                          aria-hidden
                        />

                        <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full border border-white/22 bg-black/32 px-2.5 py-1.5 backdrop-blur-md">
                          <Icon className="h-3.5 w-3.5 shrink-0 text-cyan-200/95" strokeWidth={2} aria-hidden />
                          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/95">
                            {f.pill}
                          </span>
                        </div>
                      </div>

                      <CardContent className="relative px-7 pb-7 pt-6">
                        <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">{f.title}</h3>
                        <p
                          className={`
                        mt-3 text-sm leading-[1.65] line-clamp-3
                        ${isActive ? "text-[#d2dce8]" : "text-[#b4c4d8] group-hover:text-[#c8d4e4]"}
                      `}
                        >
                          {f.desc}
                        </p>
                        <div className="mt-5 flex items-center justify-between gap-2">
                          <span
                            className={`text-xs font-semibold tracking-wide transition-colors ${
                              isActive ? "text-cyan-200" : "text-cyan-300/90 group-hover:text-cyan-200"
                            }`}
                          >
                            Explore feature <span aria-hidden>→</span>
                          </span>
                        </div>
                        <div
                          className={
                            isActive
                              ? "mt-6 h-px w-full bg-gradient-to-r from-transparent via-cyan-400/55 to-transparent opacity-100 transition-all duration-300"
                              : "mt-6 h-px w-full bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent opacity-70 transition-all duration-300 group-hover:via-cyan-400/50 group-hover:opacity-100"
                          }
                          aria-hidden
                        />

                        {isActive && (
                          <motion.div
                            layoutId="featureCardGlow"
                            className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-cyan-400/15"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </CardContent>
                    </>
                  )}
                </Card>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      <CoreFeaturesVideo />
    </section>
  );
}
