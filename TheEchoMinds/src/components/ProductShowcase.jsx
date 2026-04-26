import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const products = [
  {
    id: "product-g1",
    name: "EchoLens G.1",
    tag: "Goggles",
    short: "All-day AI at a glance",
    body:
      "Part of the EchoLens G series—a lightweight pair of AI-powered glasses built to fade into your look while putting information, translation, and assistance a glance away.",
    more: "Compare colors, finishes, and what fits your routine.",
    path: "/product-1",
    image: "/smartglass/NLB08-sunglasses (1).png",
    imageAlt: "EchoLens G.1 front",
    accent: "from-violet-500/20 via-cyan-500/10 to-transparent",
  },
  {
    id: "product-s1",
    name: "EchoLens S.1",
    tag: "Spectacles",
    short: "Featherlight daily wear",
    body:
      "Part of the EchoLens S series—engineered for the spectacles category: comfort, subtle AI, and natural controls for whole-day wear without the bulk.",
    more: "See how S.1 fits your face and your schedule.",
    path: "/product-2",
    image: "/gallery/renderings%20of%20NTY16/(5).png",
    imageAlt: "EchoLens S.1 — product rendering",
    accent: "from-amber-500/20 via-rose-500/10 to-transparent",
  },
];

function ProductCard({ product, index, navigate }) {
  return (
    <motion.article
      id={product.id}
      className="scroll-mt-24 h-full w-full max-w-md mx-auto shrink-0 snap-none md:mx-0 md:max-w-none md:w-96 md:snap-center md:shrink-0 lg:w-[28rem]"
      initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2, margin: "-5%" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="h-full p-[1px] rounded-3xl bg-gradient-to-b from-white/25 via-white/8 to-white/[0.04] group/card"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
      >
        <div className="relative h-full min-h-[30rem] sm:min-h-[32rem] rounded-3xl overflow-hidden bg-zinc-950/95 backdrop-blur-2xl border border-white/[0.08] shadow-[0_28px_100px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] group-hover/card:shadow-[0_36px_120px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.14)] group-hover/card:border-white/15 transition-shadow duration-500">
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-700"
            style={{
              background: "radial-gradient(80% 50% at 50% 0%, rgba(255,255,255,0.06) 0%, transparent 60%)",
            }}
            aria-hidden
          />
          <div className="relative h-[13rem] sm:h-[15rem] overflow-hidden">
            <img
              src={product.image}
              alt={product.imageAlt}
              className="mx-auto block h-full w-full max-h-full object-contain object-center p-2 sm:p-4 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition duration-500 ease-out will-change-transform group-hover/card:scale-[1.07] group-hover/card:-translate-y-1.5"
              loading="lazy"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-b ${product.accent} to-zinc-950 via-zinc-950/40`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
            <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-3 sm:p-4 z-10">
              <motion.div
                className="inline-flex items-center gap-1.5 rounded-full bg-black/30 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-white border border-white/15"
                whileHover={{ scale: 1.04 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Sparkles className="h-3.5 w-3.5 text-cyan-200" strokeWidth={2} />
                {product.tag}
              </motion.div>
            </div>
            <p className="absolute bottom-3 sm:bottom-4 left-4 right-4 z-10 text-sm sm:text-base text-white/80 font-light tracking-wide">
              {product.short}
            </p>
          </div>
          <div className="relative p-5 sm:p-6 flex flex-col gap-1.5">
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-balance text-white group-hover/card:text-white transition-colors">
              {product.name}
            </h3>
            <p className="text-sm sm:text-[15px] text-gray-300/95 leading-relaxed line-clamp-3 min-h-[4.5rem] sm:min-h-0">
              {product.body}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">{product.more}</p>
            <div className="pt-2 mt-1">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  className="w-full sm:w-auto rounded-full px-8 h-12 text-sm font-medium border-0 bg-gradient-to-b from-zinc-100 to-zinc-200 text-zinc-900 hover:from-white hover:to-zinc-100 shadow-lg shadow-black/20"
                  onClick={() => navigate(product.path)}
                >
                  View product
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}

export default function ProductShowcase() {
  const navigate = useNavigate();

  return (
    <section className="py-20 sm:py-28 md:py-32 w-full" aria-labelledby="product-lineup-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center sm:text-left mb-10 sm:mb-12">
          <motion.div
            id="product-lineup-heading"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-white/50 mb-2">EchoLens</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-white tracking-tight text-balance">
              Choose your form factor
            </h2>
            <p className="mt-3 sm:mt-4 text-gray-400 text-base sm:text-lg max-w-2xl sm:max-w-3xl mx-auto sm:mx-0">
              Goggles for immersive utility, or spectacles for all-day comfort.{" "}
              <span className="text-white/40 hidden md:inline">Scroll the row to compare both models.</span>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Small screens: stacked column so both products load in view; md+: horizontal strip with snap */}
      <div
        className="blog-strip-scroll -mx-4 sm:-mx-6 max-w-6xl mx-auto max-md:overflow-x-visible md:overflow-x-auto md:overflow-y-visible md:scroll-smooth md:snap-x md:snap-mandatory pb-3"
        style={{ WebkitOverflowScrolling: "touch" }}
        role="list"
        aria-label="EchoLens product models"
      >
        <div className="flex max-md:w-full max-md:min-w-0 max-md:flex-col max-md:items-stretch max-md:gap-8 md:w-max md:min-w-full md:flex-nowrap md:items-stretch md:justify-center gap-5 sm:gap-6 md:gap-8 px-4 sm:px-6">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} navigate={navigate} />
          ))}
        </div>
      </div>
    </section>
  );
}
