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

const PRODUCT_FAQS_G1 = [
  {
    q: "What is included in the box with EchoLens G.1?",
    a: "EchoLens G.1, USB-C charging cable, microfiber cloth, printed warranty/quick-start card, and in-box items listed on your invoice.",
  },
  {
    q: "Is EchoLens G.1 water resistant?",
    a: "G.1 is rated IP55 for resistance to dust and water splashes. It is not designed for swimming or submersion—remove before showering or heavy rain if possible.",
  },
  {
    q: "How long does the battery last?",
    a: "The 220 mAh battery is tuned for up to about 7 hours of music playback under typical use. Camera and translation features may reduce runtime; charge fully before long days out.",
  },
  {
    q: "Can I return or exchange my order?",
    a: "Return and exchange windows follow our store policies at the time of purchase. See Terms of Use and shipping pages linked in the footer, or contact support with your order ID.",
  },
  {
    q: "How do I get app or firmware updates?",
    a: "Connect EchoLens with the companion app when available. Updates will be announced on our site and through account email—enable notifications in your device settings for major releases.",
  },
];

const G1_GALLERY = [
  { src: "/smartglass/NLB08-sunglasses (1).png", alt: "EchoLens G.1 — hero angle" },
  { src: "/smartglass/NLB08-sunglasses(2).png", alt: "EchoLens G.1 — side profile" },
  { src: "/smartglass/NLB08-sunglasses (3).png", alt: "EchoLens G.1 — detail" },
  { src: "/smartglass/NLB08-sunglasses (4).png", alt: "EchoLens G.1 — lenses" },
  { src: "/smartglass/NLB08-sunglasses(5).png", alt: "EchoLens G.1 — full frame" },
  { src: "/smartglass/NLB08-sunglasses (6).png", alt: "EchoLens G.1 — alternate view" },
];

const G1_IN_BOX = [
  { label: "EchoLens G.1 device", sub: "Smart glasses with tuned lenses", icon: "device" },
  { label: "USB-C charging cable", sub: "Fast, reliable power for daily use", icon: "usb" },
  { label: "Microfiber cleaning cloth", sub: "Safe for lenses and frame", icon: "cloth" },
  { label: "Warranty & quick-start card", sub: "1 year terms + first-time setup", icon: "warranty" },
];

const G1_FEATURES = [
  {
    kicker: "Imaging",
    title: "Camera",
    body: "20 MP, anti-shake, 1080p @ 30 fps — clear, stable video whether you are walking, cycling, or grabbing a quick moment.",
    image: "/images/photo_2026-04-26_00-51-49.jpg",
    imageAlt: "EchoLens camera detail",
    reverse: false,
    fullBleed: true,
    revealTextOnInteract: true,
  },
  {
    kicker: "All-day",
    title: "Battery & endurance",
    body: "220 mAh for up to ~7 hours of music, plus real-world mixed use. Photography and AI features may shorten runtime; top up when you can.",
    image: "/images/original-a0695a2aff4a45bae2ba8e1c5c394146.gif",
    imageAlt: "Battery and daily use",
    reverse: true,
    fullBleed: true,
    revealTextOnInteract: true,
  },
  {
    kicker: "Intelligence",
    title: "Image recognition",
    body: "Instantly identifies objects, text, and context in any photo as you shoot—so you get answers in the moment, not after the fact.",
    image: "/images/1_NLnnf_M4Nlm4p1GAWrWUCQ.gif",
    imageAlt: "Visual context and recognition",
    reverse: false,
    fullBleed: true,
    revealTextOnInteract: true,
  },
  {
    kicker: "Global",
    title: "Live translation",
    body: "Hear and speak across languages with open-ear audio tuned for travel and meetings—less friction when you switch languages mid-day.",
    image: "/images/66d66741f0c8f60276394a98_qc_yodao_animationheader.gif",
    imageAlt: "Conversations across languages",
    reverse: true,
    fullBleed: true,
    revealTextOnInteract: true,
  },
  {
    kicker: "Daily use",
    title: "IP55 & durability",
    body: "Dust- and splash-resistant for sweat, light rain, and commutes. Wipe down with the included cloth; avoid submersion and salt water.",
    image: "/images/fcd5b15d42a95b5b56f2cc2eff85e02d.gif",
    imageAlt: "Sweat and light rain",
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
          leading={<h1 className="text-lg font-semibold tracking-wide text-white sm:text-xl">EchoLens G.1</h1>}
        />

        <section className="px-4 sm:px-6 pb-6 pt-4 max-w-6xl mx-auto">
          <ProductImageCarousel images={G1_GALLERY} />

          <motion.div
            className="text-center sm:text-left mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-cyan-400/90">EchoLens G series</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold mt-2 text-white">EchoLens G.1</h1>
            <p className="text-zinc-400 text-sm sm:text-base mt-3 max-w-2xl mx-auto sm:mx-0">
              G.1 is part of the G series—smart eyewear with lightweight intelligence on your face: camera, audio, and
              AI that stays out of the way until you need it.
            </p>
          </motion.div>

          <div className="mt-8 flex w-full flex-col items-center text-center px-2">
            <p className="text-2xl font-semibold text-white tabular-nums tracking-tight">₹22,595</p>
            <ProductQuickActions
              likeKey="product-1"
              sku="g1"
              productLabel="EchoLens G.1"
              className="mt-4"
            />
          </div>
        </section>

        <div className="px-4 sm:px-6 max-w-6xl mx-auto">
          <ProductAboutAndInBox
            productName="EchoLens G.1"
            description="EchoLens G.1 is the goggles-style flagship of the G series—built for all-day comfort: a balanced fit, open-ear sound, and quick interactions without pulling out your phone. The frame handles commute, work, and weekend wear with a matte, modern finish that does not scream ‘gadget’—it feels like a pair of glasses you already love, now with a camera, mic, and smart features woven in. Whether you are navigating a city, capturing a memory, or following a live translation, G.1 is designed to fade into the background when you are focused and step forward when you are not."
            inBox={G1_IN_BOX}
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
            See what it does
          </h2>
          <p className="text-sm text-zinc-500 text-center sm:text-left mb-6 max-w-2xl">
            Premium hardware, paired with features you will use every day—not a spec sheet, a story.
          </p>
        </div>
        <ProductFeatureGrid features={G1_FEATURES} />

        <ProductReviewsSection productId="product-1" productTitle="EchoLens G.1" />
        <ProductFaqSection productTitle="EchoLens G.1" faqs={PRODUCT_FAQS_G1} />
        <SiteFooter />
      </div>
    </div>
  );
}
