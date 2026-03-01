import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";

export default function Product() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

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
        <section className="pt-20 pb-16 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="flex items-center justify-between gap-6 flex-wrap"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-gray-400">EchoLens G.1</p>
                <h1 className="text-4xl md:text-6xl font-semibold mt-3">Product details</h1>
                <p className="text-gray-300 mt-4 max-w-2xl">
                  A clean, lightweight build with intelligence that stays out of the way until you
                  need it.
                </p>
              </div>
              <div className="flex items-center gap-3">
                {isLoggedIn && (
                  <Button
                    variant="outline"
                    className="rounded-full px-6 py-5"
                    onClick={() => logout(navigate)}
                  >
                    Logout
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="rounded-full px-6 py-5"
                  onClick={() => navigate("/")}
                >
                  Back to home
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="pb-24 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
            {/* Left column: sticky product summary */}
            <motion.div
              className="space-y-6 md:sticky md:top-28"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="rounded-3xl overflow-hidden bg-black/40 border border-white/10">
                <img
                  src="/smartglass/NLB08-sunglasses(5).png"
                  alt="EchoLens product view"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="bg-black/60 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                <h2 className="text-2xl md:text-3xl font-medium mb-4">Designed for all-day wear</h2>
                <p className="text-gray-300 leading-relaxed">
                  EchoLens pairs a refined silhouette with balanced weight distribution, so it feels
                  invisible even during long sessions. The lenses and frame are tuned for clarity and
                  comfort across every environment.
                </p>
                <div className="mt-8 grid gap-3 text-sm text-gray-300">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span>CPU</span>
                    <span className="text-white">JL7018F</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span>Speaker</span>
                    <span className="text-white">Dual speakers (Dual MIC)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Memory</span>
                    <span className="text-white">32Gb</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-4">
                    <span>Price</span>
                    <span className="text-xl font-semibold text-white">₹11,999</span>
                  </div>
                </div>
                <Button
                  className="mt-8 w-full rounded-full"
                  variant="default"
                  onClick={() =>
                    navigate("/checkout", {
                      state: {
                        product: {
                          name: "EchoLens G.1",
                          model: "Lens G1",
                          amount: 11999,
                        },
                      },
                    })
                  }
                >
                  Order now
                </Button>
              </div>
            </motion.div>

            {/* Right column: scrolling feature blocks */}
            <div className="flex flex-col gap-8">
              <motion.div
                className="flex flex-col md:flex-row bg-black/50 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 min-h-[220px]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="md:w-1/2 w-full h-48 md:h-auto bg-black/60">
                  <img
                    src="/smartglass/NLB08-sunglasses(2).png"
                    alt="Camera specification"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="md:w-1/2 w-full p-6 md:p-8 flex flex-col justify-center">
                  <h3 className="text-lg font-medium mb-2">Camera</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    2000W, anti-shake, 1080P 30fps camera that keeps every moment sharp and stable,
                    whether you&apos;re walking, running, or capturing quick snapshots on the go.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex flex-col md:flex-row-reverse bg-black/50 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 min-h-[220px]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="md:w-1/2 w-full h-48 md:h-auto bg-black/60">
                  <img
                    src="images\istockphoto-1046965420-612x612.jpg"
                    alt="Battery specification"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="md:w-1/2 w-full p-6 md:p-8 flex flex-col justify-center">
                  <h3 className="text-lg font-medium mb-2">Battery &amp; endurance</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Battery: 220mAh
                    <br />
                    Music playback endurance: 7 hours
                    <br />
                    Photography endurance: 1+ hours
                    <br />
                    Designed for a full day of light use without constantly needing to recharge.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex flex-col md:flex-row bg-black/50 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 min-h-[220px]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="md:w-1/2 w-full h-48 md:h-auto bg-black/60">
                  <img
                    src="images\shutterstock_731158624.jpg"
                    alt="Image recognition feature"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="md:w-1/2 w-full p-6 md:p-8 flex flex-col justify-center">
                  <h3 className="text-lg font-medium mb-2">Image recognition</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Intelligent image recognition of each clicked photo, helping you understand
                    scenes, objects, and surroundings with contextual insights in real time.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex flex-col md:flex-row-reverse bg-black/50 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 min-h-[220px]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="md:w-1/2 w-full h-48 md:h-auto bg-black/60">
                  <img
                    src="images\live translation.jpg"
                    alt="Live translation feature"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 w-full p-6 md:p-8 flex flex-col justify-center">
                  <h3 className="text-lg font-medium mb-2">Live translation</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Live translation of voice so you can listen, speak, and stay in sync across
                    languages during conversations, travel, and everyday interactions.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex flex-col md:flex-row bg-black/50 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 min-h-[220px]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="md:w-1/2 w-full h-48 md:h-auto bg-black/60">
                  <img
                    src="images\waterproof2.webp"
                    alt="Waterproof rating"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 w-full p-6 md:p-8 flex flex-col justify-center">
                  <h3 className="text-lg font-medium mb-2">Waterproof</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Waterproof: IP55 rating to protect against sweat, light rain, and everyday
                    splashes, keeping your device ready for real-world use.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Smartglass photo gallery */}
        <section className="pb-32 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mb-10"
            >
              <h2 className="text-2xl md:text-3xl font-medium mb-3">Photo gallery</h2>
              <p className="text-gray-300 text-sm md:text-base">
                A closer look at EchoLens smart glasses from every angle.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                "/smartglass/NLB08-sunglasses (1).png",
                "/smartglass/NLB08-sunglasses(2).png",
                "/smartglass/NLB08-sunglasses (3).png",
                "/smartglass/NLB08-sunglasses (4).png",
                "/smartglass/NLB08-sunglasses(5).png",
                "/smartglass/NLB08-sunglasses (6).png",
              ].map((src, index) => (
                <motion.div
                  key={src}
                  className="rounded-2xl overflow-hidden bg-black/40 border border-white/10"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true, margin: "-50px" }}
                >
                  <img src={src} alt={`EchoLens smartglass ${index + 1}`} className="w-full h-64 object-cover" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* <section className="pb-20 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Key specs",
                desc: "Featherlight frame, spatial audio, and quick charge support for daily carry.",
              },
              {
                title: "Included",
                desc: "EchoLens, charging case, USB‑C cable, cleaning kit, and protective pouch.",
              },
              {
                title: "Finishes",
                desc: "Matte black, graphite, and midnight blue with swappable nose pads.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="bg-black/50 backdrop-blur-md rounded-3xl p-6 border border-white/10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <h3 className="text-lg font-medium mb-3">{item.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section> */}

        {/* <section className="pb-24 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="grid md:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="rounded-3xl overflow-hidden bg-black/40 border border-white/10">
                <img
                  src="https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rw4012506011m_11.png"
                  alt="EchoLens front view"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-3xl overflow-hidden bg-black/40 border border-white/10">
                <img
                  src="https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rw4012506011m_18.png"
                  alt="EchoLens side view"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-3xl overflow-hidden bg-black/40 border border-white/10">
                <img
                  src="/images/rbm-case-data.webp"
                  alt="EchoLens case and accessories"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </section> */}
      </div>
    </div>
  );
}
