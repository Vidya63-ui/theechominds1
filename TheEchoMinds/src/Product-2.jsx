import { useEffect } from "react";
import { motion } from "framer-motion";
import SiteSubpageHeader from "@/components/SiteSubpageHeader.jsx";
import SiteFooter from "@/components/SiteFooter.jsx";
import ProductFaqSection from "@/components/ProductFaqSection.jsx";
import ProductReviewsSection from "@/components/ProductReviewsSection.jsx";
import ProductImageCarousel from "@/components/product/ProductImageCarousel.jsx";
import ProductQuickActions from "@/components/product/ProductQuickActions.jsx";
import ProductAboutAndInBox from "@/components/product/ProductAboutAndInBox.jsx";
import ProductFeatureGrid from "@/components/product/ProductFeatureGrid.jsx";

const PRODUCT_FAQS_S1 = [
  {
    q: "What is in the box for EchoLens S.1?",
    a: "EchoLens S.1, USB-C charging cable, microfiber cloth, warranty/quick-start card, and items listed on your invoice at purchase.",
  },
  {
    q: "How is EchoLens S.1 different from G.1?",
    a: "S.1 is built for the spectacles category—optimized for everyday prescription-style wear and comfort. G.1 targets a different frame style. Compare specs on each product page before you order.",
  },
  {
    q: "When will S.1 ship if I pre-order?",
    a: "Pre-order timelines are communicated at checkout and in your confirmation email. Dates can shift; we will notify you of any material change to the shipping window.",
  },
  {
    q: "Is the device water resistant?",
    a: "EchoLens S.1 is IP55 rated against dust and splashes. Do not submerge it or use it in salt water; dry the device if it gets wet.",
  },
  {
    q: "Where can I read warranty and return terms?",
    a: "Warranty, returns, and repair information are in the policy links in the site footer. Keep your order ID handy when you contact support.",
  },
];

const S1_GALLERY_BASE = "/gallery/renderings%20of%20NTY16";
const S1_GALLERY = [
  { src: `${S1_GALLERY_BASE}/(5).png`, alt: "EchoLens S.1 — rendering" },
  { src: `${S1_GALLERY_BASE}/(6).png`, alt: "EchoLens S.1 — rendering" },
  { src: `${S1_GALLERY_BASE}/(7).png`, alt: "EchoLens S.1 — rendering" },
  { src: `${S1_GALLERY_BASE}/(8).png`, alt: "EchoLens S.1 — rendering" },
  { src: `${S1_GALLERY_BASE}/(9).png`, alt: "EchoLens S.1 — rendering" },
  { src: `${S1_GALLERY_BASE}/(10).png`, alt: "EchoLens S.1 — rendering" },
];

const S1_IN_BOX = [
  { label: "EchoLens S.1 device", sub: "Spectacles-style smart frame", icon: "device" },
  { label: "USB-C charging cable", sub: "Powers your device through daily use", icon: "usb" },
  { label: "Microfiber cleaning cloth", sub: "For lenses and frame care", icon: "cloth" },
  { label: "Warranty & quick-start card", sub: "1 year coverage + first-time setup", icon: "warranty" },
];

const S1_FEATURES = [
  {
    kicker: "Imaging",
    title: "Camera",
    body: "20 MP with stabilization and 1080p video—document your day without reaching for your phone, in a frame made for spectacles wearers.",
    image: "/images/photo_2026-04-26_00-51-49.jpg",
    imageAlt: "EchoLens S.1 camera",
    reverse: false,
    fullBleed: true,
    revealTextOnInteract: true,
  },
  {
    kicker: "All-day",
    title: "Battery & endurance",
    body: "220 mAh for long music sessions and light mixed use. Heavy camera or translation will reduce runtime—plan a short charge before long days.",
    image: "/images/original-a0695a2aff4a45bae2ba8e1c5c394146.gif",
    imageAlt: "Battery life",
    reverse: true,
    fullBleed: true,
    revealTextOnInteract: true,
  },
  {
    kicker: "Intelligence",
    title: "Image recognition",
    body: "Instantly identifies objects, text, and context in any photo as you shoot—so you get answers in the moment, not after the fact.",
    image: "/images/1_NLnnf_M4Nlm4p1GAWrWUCQ.gif",
    imageAlt: "Recognition and context",
    reverse: false,
    fullBleed: true,
    revealTextOnInteract: true,
  },
  {
    kicker: "Global",
    title: "Live translation",
    body: "Hear and speak across languages with open-ear audio tuned for travel and meetings—less friction when you switch languages mid-day.",
    image: "/images/66d66741f0c8f60276394a98_qc_yodao_animationheader.gif",
    imageAlt: "Live translation",
    reverse: true,
    fullBleed: true,
    revealTextOnInteract: true,
  },
  {
    kicker: "Daily use",
    title: "IP55 & durability",
    body: "Rated for dust and splashes during real life—commute, office, and light weather. Not for swimming; dry the device if it gets wet.",
    image: "/images/fcd5b15d42a95b5b56f2cc2eff85e02d.gif",
    imageAlt: "Splash resistance",
    reverse: false,
    fullBleed: true,
    revealTextOnInteract: true,
  },
];

export default function Product() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen text-white">
      <div className="fixed inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
          poster="/videos/echolens-bg-poster.jpg"
        >
          <source src="/videos/24541-343454486_medium.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      <div className="relative z-10">
        <SiteSubpageHeader
          leading={<h1 className="text-lg font-semibold tracking-wide text-white sm:text-xl">EchoLens S.1</h1>}
        />

        <section className="px-4 sm:px-6 pb-6 pt-4 max-w-6xl mx-auto">
          <ProductImageCarousel images={S1_GALLERY} />

          <motion.div
            className="text-center sm:text-left mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-violet-300/90">EchoLens S series</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold mt-2 text-white">EchoLens S.1</h1>
            <p className="text-zinc-400 text-sm sm:text-base mt-3 max-w-2xl mx-auto sm:mx-0">
              S.1 is part of the S series—a comfortable, prescription-friendly profile with the same core AI: camera,
              audio, and assistive smarts in a frame that looks at home in work and daily life.
            </p>
          </motion.div>

          <div className="mt-8 flex w-full flex-col items-center text-center px-2">
            <p className="text-2xl font-semibold text-white tabular-nums tracking-tight">₹19,750</p>
            <p className="text-xs text-zinc-500 mt-2 max-w-lg text-balance">
              Add to cart opens a guided flow: lens type, optical power (OD/OS from dropdowns), usage, material, and
              coatings — then checkout. Review your bag from <span className="text-zinc-400">My profile</span>.
            </p>
            <ProductQuickActions likeKey="product-2" sku="s1" productLabel="EchoLens S.1" className="mt-4" />
          </div>
        </section>

        <div className="px-4 sm:px-6 max-w-6xl mx-auto">
          <ProductAboutAndInBox
            productName="EchoLens S.1"
            description="EchoLens S.1 is the spectacles-line offering in the S series—it brings the EchoMinds experience to a spectacles-first design: lightweight temples, stable fit for long screen days, and a neutral look that does not trade style for smarts. Use it for open-ear music, quick captures, and assistive features when you are on the move—without the bulk of a dedicated camera rig. S.1 is the option when you want AI on your face in a form factor that matches everyday glasses, with the same 1 year warranty and in-box care as the rest of the line."
            inBox={S1_IN_BOX}
          />

          <section className="py-5 sm:py-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-[0.22em] text-white mb-5 sm:mb-6 drop-shadow-[0_2px_16px_rgba(0,0,0,0.92)] [text-shadow:0_1px_2px_rgba(0,0,0,0.85)]">
              Core specs
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                { k: "CPU", v: "JL7018F" },
                { k: "Audio", v: "Dual speakers + mics" },
                { k: "Storage", v: "32 GB" },
                { k: "Dust & water", v: "IP55" },
              ].map((s) => (
                <div
                  key={s.k}
                  className="rounded-2xl border border-white/20 bg-zinc-950/90 px-4 py-4 sm:px-5 sm:py-4 text-center shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-md ring-1 ring-white/[0.06]"
                >
                  <p className="text-xs sm:text-sm font-semibold text-zinc-300 uppercase tracking-wider">{s.k}</p>
                  <p className="text-base sm:text-lg text-white font-semibold mt-1.5 leading-snug">{s.v}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="px-4 sm:px-6 max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white text-center sm:text-left mb-2">
            Built for how you see the day
          </h2>
          <p className="text-sm text-zinc-500 text-center sm:text-left mb-6 max-w-2xl">
            The same core platform as G.1, tuned for spectacles—comfort, audio, and practical smarts.
          </p>
        </div>
        <ProductFeatureGrid features={S1_FEATURES} />

        <ProductReviewsSection productId="product-2" productTitle="EchoLens S.1" />
        <ProductFaqSection productTitle="EchoLens S.1" faqs={PRODUCT_FAQS_S1} />
        <SiteFooter />
      </div>
    </div>
  );
}
