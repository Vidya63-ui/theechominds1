import { motion } from "framer-motion";
import { Battery, Brain, Camera, Droplets, Globe2, Mic2, Smartphone, Sparkles } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

function iconForKicker(kicker) {
  const k = (kicker || "").toLowerCase();
  if (k.includes("intelligence")) return Brain;
  if (k.includes("global")) return Globe2;
  if (k.includes("imaging")) return Camera;
  if (k.includes("all-day") || k.includes("battery")) return Battery;
  if (k.includes("daily")) return Droplets;
  if (k.includes("voice") || k.includes("audio")) return Mic2;
  if (k.includes("app") || k.includes("companion")) return Smartphone;
  return Sparkles;
}

/**
 * @param {{
 *   features: { title: string, kicker?: string, body: string, image: string, imageAlt: string, reverse?: boolean, fullBleed?: boolean, revealTextOnInteract?: boolean }[]
 * }} props
 */
export default function ProductFeatureGrid({ features }) {
  return (
    <section className="py-10 sm:py-14" aria-label="Key features">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          className="blog-strip-scroll -mx-4 sm:-mx-6 flex flex-nowrap gap-4 sm:gap-5 overflow-x-auto overflow-y-visible scroll-smooth snap-x snap-mandatory pl-4 pr-3 sm:pl-6 sm:pr-5 pb-3 pt-0.5"
          style={{ WebkitOverflowScrolling: "touch" }}
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          role="list"
          aria-label="Product features — scroll horizontally"
        >
          {features.map((f) => {
            const Icon = iconForKicker(f.kicker);
            const fullBleed = Boolean(f.fullBleed);
            const revealText = Boolean(f.revealTextOnInteract);
            return (
              <motion.article
                key={f.title}
                role="listitem"
                variants={item}
                className="snap-center shrink-0 w-[min(22rem,88vw)] sm:w-[23rem] md:w-96 max-w-md"
              >
                <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-[#12151C] shadow-[0_12px_48px_rgba(0,0,0,0.45)] transition-all duration-300 ease-out hover:border-cyan-400/40 hover:shadow-[0_20px_56px_-12px_rgba(34,211,238,0.14)]">
                  {fullBleed && revealText ? (
                    <div
                      role="region"
                      aria-label={`${f.title} — tap or hover to read details`}
                      tabIndex={0}
                      onPointerDown={(e) => e.currentTarget.focus({ preventScroll: true })}
                      className="group/fullbleed relative flex min-h-[26rem] w-full flex-col overflow-hidden bg-zinc-900 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-400/45 sm:min-h-[28rem]"
                    >
                      <img
                        src={f.image}
                        alt={f.imageAlt}
                        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center transition-transform duration-300 ease-out group-hover/fullbleed:scale-105 motion-reduce:transition-none"
                        loading="lazy"
                      />
                      <div
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/35 to-black/15"
                        aria-hidden
                      />
                      <div
                        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/35 to-transparent"
                        aria-hidden
                      />

                      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between px-6 pb-6 pt-4 opacity-0 transition-opacity duration-300 ease-out group-hover/fullbleed:pointer-events-auto group-hover/fullbleed:opacity-100 group-focus-within/fullbleed:pointer-events-auto group-focus-within/fullbleed:opacity-100 motion-reduce:transition-none sm:px-7 sm:pb-7 sm:pt-5">
                        <div className="shrink-0">
                          {f.kicker && (
                            <div className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-2.5 py-1.5 backdrop-blur-md">
                              <Icon className="h-3.5 w-3.5 shrink-0 text-cyan-200/95" strokeWidth={2} aria-hidden />
                              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/95">
                                {f.kicker}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="relative flex flex-col pt-12 sm:pt-16">
                          <h3 className="text-xl font-bold text-white tracking-tight leading-tight text-balance sm:text-2xl">
                            {f.title}
                          </h3>
                          <p className="mt-3 text-sm leading-[1.65] text-white/90 line-clamp-4">{f.body}</p>
                          <div className="mt-4 flex items-center sm:mt-5">
                            <span className="text-xs font-semibold tracking-wide text-cyan-300/90 transition-colors group-hover/fullbleed:text-cyan-200">
                              Explore feature <span aria-hidden>→</span>
                            </span>
                          </div>
                          <div
                            className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-cyan-500/35 to-transparent opacity-80 transition-all duration-300 group-hover/fullbleed:via-cyan-400/55 group-hover/fullbleed:opacity-100 sm:mt-6"
                            aria-hidden
                          />
                        </div>
                      </div>
                    </div>
                  ) : fullBleed ? (
                    <div className="relative flex min-h-[26rem] w-full flex-col overflow-hidden bg-zinc-950 sm:min-h-[28rem]">
                      <img
                        src={f.image}
                        alt={f.imageAlt}
                        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                      <div
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/25"
                        aria-hidden
                      />
                      <div
                        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/50 to-transparent"
                        aria-hidden
                      />

                      {f.kicker && (
                        <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-2.5 py-1.5 backdrop-blur-md">
                          <Icon className="h-3.5 w-3.5 shrink-0 text-cyan-200/95" strokeWidth={2} aria-hidden />
                          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/95">
                            {f.kicker}
                          </span>
                        </div>
                      )}

                      <div className="relative z-10 mt-auto flex flex-col px-6 pb-6 pt-16 sm:px-7 sm:pb-7 sm:pt-20">
                        <h3 className="text-xl font-bold text-white tracking-tight leading-tight text-balance sm:text-2xl">
                          {f.title}
                        </h3>
                        <p className="mt-3 text-sm leading-[1.65] text-white/85 line-clamp-4">{f.body}</p>
                        <div className="mt-4 flex items-center sm:mt-5">
                          <span className="text-xs font-semibold tracking-wide text-cyan-300/90 transition-colors group-hover:text-cyan-200">
                            Explore feature <span aria-hidden>→</span>
                          </span>
                        </div>
                        <div
                          className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-cyan-500/35 to-transparent opacity-80 transition-all duration-300 group-hover:via-cyan-400/55 group-hover:opacity-100 sm:mt-6"
                          aria-hidden
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="relative w-full shrink-0 aspect-[16/10] overflow-hidden bg-zinc-950">
                        <img
                          src={f.image}
                          alt={f.imageAlt}
                          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-105"
                          loading="lazy"
                        />
                        <div
                          className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-black/90 via-black/50 to-transparent"
                          aria-hidden
                        />
                        <div
                          className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent"
                          aria-hidden
                        />

                        {f.kicker && (
                          <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-2.5 py-1.5 backdrop-blur-md">
                            <Icon className="h-3.5 w-3.5 shrink-0 text-cyan-200/95" strokeWidth={2} aria-hidden />
                            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/95">
                              {f.kicker}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col px-6 pb-6 pt-5 sm:px-7 sm:pb-7 sm:pt-6">
                        <h3 className="text-xl font-bold text-white tracking-tight leading-tight text-balance sm:text-2xl">
                          {f.title}
                        </h3>
                        <p className="mt-3 text-sm leading-[1.65] text-[#A3ADC2] line-clamp-3">{f.body}</p>
                        <div className="mt-4 flex items-center sm:mt-5">
                          <span className="text-xs font-semibold tracking-wide text-cyan-300/90 transition-colors group-hover:text-cyan-200">
                            Explore feature <span aria-hidden>→</span>
                          </span>
                        </div>
                        <div
                          className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent opacity-70 transition-all duration-300 group-hover:via-cyan-400/50 group-hover:opacity-100 sm:mt-6"
                          aria-hidden
                        />
                      </div>
                    </>
                  )}
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
