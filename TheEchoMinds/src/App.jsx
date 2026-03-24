import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";

export default function EchoLensWebsite() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const goWithAuth = (pathIfLoggedIn = "/preorder") => {
    navigate(pathIfLoggedIn);
  };

  const features = [
    { title: "AI Vision", desc: "See and understand the world in real time with on-device AI." },
    { title: "Live Translation", desc: "Instant subtitles for the real world." },
    { title: "Voice Assistant", desc: "Hands-free, natural conversations." },
    { title: "All-day Battery", desc: "Optimized for continuous daily use." },
    { title: "Privacy First", desc: "Your data stays on your device." },
  ];

  return (
    <div className="relative min-h-screen text-white">
      <div className="fixed inset-0 z-0 overflow-hidden">
        <video autoPlay loop muted playsInline className="h-full w-full object-cover" poster="/videos/echolens-bg-poster.jpg">
          <source src="/videos/4753-179739298_medium.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      <div className="relative z-10">
        <header className="sticky top-0 z-20 px-6 py-4 ">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <h1 className="text-lg md:text-xl font-semibold tracking-wide">The EchoMinds</h1>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-full" onClick={() => navigate("/")}>
                Home
              </Button>
              <Button className="rounded-full" onClick={() => navigate("/about")}>
                About
              </Button>
              {isLoggedIn && (
                <Button variant="outline" className="rounded-full" onClick={() => logout(navigate)}>
                  Logout
                </Button>
              )}
            </div>
          </div>
        </header>

        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center max-w-4xl px-6"
          >
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6">EchoLens</h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10">AI smart glasses by TheEchoMinds</p>
            <motion.div
              className="flex justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="rounded-full px-8 py-6 text-base" onClick={() => goWithAuth("/preorder")}>
                  Pre-order
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="rounded-full px-8 py-6 text-base"
                  onClick={() => goWithAuth("/how-it-works")}
                >
                  See how it works
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        <section className="py-32 px-6 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-medium mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              A new way to interact with reality
            </motion.h2>
            <motion.p
              className="text-gray-400 text-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              EchoLens blends advanced AI, spatial audio and micro-displays into a lightweight wearable designed for everyday life.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col md:flex-row items-center justify-center gap-8 md:text-left"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              viewport={{ once: true, margin: "-80px" }}
            >
              <div className="w-40 md:w-56">
                <img
                  src="/images/netherlands-map.png"
                  alt="Map of the Netherlands"
                  className="w-full h-auto object-contain"
                />
              </div>
              <div>
                <p className="text-gray-300 text-sm md:text-base max-w-md">
                Software and model trained in collaboration with{" "}
  <span className="font-bold">Voxdiscover</span> in the{" "}
  <span className="font-bold">Netherlands</span>.
                </p>
                <p className="mt-4 text-4xl md:text-5xl font-semibold tracking-[0.2em]">
                  Hey Echo...
                </p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        <section className="py-24 px-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Card className="bg-black/50 backdrop-blur-md border border-white/20 rounded-2xl transition-shadow duration-300 hover:border-white/40">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-medium mb-3">{f.title}</h3>
                    <p className="text-gray-300">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="py-32 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              className="bg-black/50 backdrop-blur-md rounded-3xl p-10 border border-white/5"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.h2 className="text-3xl md:text-4xl font-medium mb-6">EchoLens G.1</motion.h2>
              <motion.p className="text-gray-200 mb-6">
                EchoLens is a lightweight pair of AI-powered glasses designed to disappear on your face while giving you instant access to information, translation, and assistance.
              </motion.p>
              <motion.p className="text-gray-300 text-sm md:text-base mb-6">
                Explore the full EchoLens lineup, compare colors and finishes, and see how each model fits into your day.
              </motion.p>
              <Button className="rounded-full px-8" onClick={() => navigate("/product-1")}>View product</Button>
            </motion.div>
            <motion.div
              className="h-72 md:h-96 rounded-3xl bg-gradient-to-br from-zinc-800/70 to-zinc-900/70 p-4 grid grid-cols-2 gap-4 border border-white/5 backdrop-blur-md"
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="col-span-1 rounded-2xl overflow-hidden bg-black/40 flex items-center justify-center">
                <img src="/smartglass/NLB08-sunglasses (1).png" alt="EchoLens front view" className="w-full h-full object-cover" />
              </div>
              <div className="col-span-1 rounded-2xl overflow-hidden bg-black/40 flex items-center justify-center">
                <img src="/smartglass/NLB08-sunglasses (6).png" alt="EchoLens side view" className="w-full h-full object-cover" />
              </div>
              <div className="col-span-2 rounded-2xl overflow-hidden bg-black/40 flex items-center justify-center">
                <img src="/images/rbm-case-data.webp" alt="EchoLens case and accessories" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-32 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              className="bg-black/50 backdrop-blur-md rounded-3xl p-10 border border-white/5"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.h2 className="text-3xl md:text-4xl font-medium mb-6">EchoLens S.1</motion.h2>
              <motion.p className="text-gray-200 mb-6">
                Designed for the spectacles category, combining comfort with advanced AI features for
                daily wear. Featherlight frame and intuitive controls for seamless all-day use.
              </motion.p>
              <motion.p className="text-gray-300 text-sm md:text-base mb-6">
                Explore the spectacles lineup and see how S.1 fits into your day.
              </motion.p>
              <Button className="rounded-full px-8" onClick={() => navigate("/product-2")}>View product</Button>
            </motion.div>
            <motion.div
              className="h-72 md:h-96 rounded-3xl bg-gradient-to-br from-zinc-800/70 to-zinc-900/70 p-4 grid grid-cols-2 gap-4 border border-white/5 backdrop-blur-md"
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="col-span-1 rounded-2xl overflow-hidden bg-black/40 flex items-center justify-center">
                <img src="/smartglass/NLB08-sunglasses (1).png" alt="EchoLens S.1 front view" className="w-full h-full object-cover" />
              </div>
              <div className="col-span-1 rounded-2xl overflow-hidden bg-black/40 flex items-center justify-center">
                <img src="/smartglass/NLB08-sunglasses (6).png" alt="EchoLens S.1 side view" className="w-full h-full object-cover" />
              </div>
              <div className="col-span-2 rounded-2xl overflow-hidden bg-black/40 flex items-center justify-center">
                <img src="/images/rbm-case-data.webp" alt="EchoLens S.1 accessories" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-32 px-6 text-center">
          <motion.h2 className="text-3xl font-medium mb-4">Get early access</motion.h2>
          <motion.p className="text-gray-400 mb-10">Join the waitlist for EchoLens.</motion.p>
          <motion.div className="flex justify-center gap-3 max-w-md mx-auto">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="flex-1 rounded-full px-5 py-3 text-black"
            />
            <Button className="rounded-full px-6" onClick={() => goWithAuth("/preorder")}>Join</Button>
          </motion.div>
        </section>

        <motion.footer className="py-12 px-6 text-center border-t border-zinc-800 bg-black/40 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto flex flex-col items-center gap-4">
            {/* <Button className="rounded-full px-8" onClick={() => navigate("/about")}>About The EchoMinds</Button> */}
            <Link to="/privacy-policy" className="text-sm text-gray-500 hover:text-white hover:underline">
              Privacy Policy
            </Link>
            <p className="text-gray-500 text-sm">Copyright {new Date().getFullYear()} TheEchoMinds. All rights reserved.</p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
