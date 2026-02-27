import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function AboutPage() {
  const navigate = useNavigate();

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
          <source src="/videos/4753-179739298_medium.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      <div className="relative z-10">
        <header className="sticky top-0 z-20 px-6 py-4 border-b border-white/10 bg-black/30 backdrop-blur-md">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <h1 className="text-lg md:text-xl font-semibold tracking-wide">The EchoMinds</h1>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-full" onClick={() => navigate("/")}>
                Home
              </Button>
              <Button className="rounded-full" onClick={() => navigate("/about")}>
                About
              </Button>
            </div>
          </div>
        </header>

        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto space-y-10 text-sm md:text-base text-gray-300">
            <motion.div
              className="space-y-3 rounded-3xl "
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl font-semibold text-white">About The EchoMinds</h2>
              <p>
                The EchoMinds is an AI-integrated devices company dedicated to seamlessly connecting everyday life
                with artificial intelligence and modern technologies. Our mission is to transform the way people
                interact with the world by building intelligent, intuitive, and human-centric wearable innovations.
              </p>
              <p>
                At The EchoMinds, we focus on developing smart devices that enhance productivity, accessibility,
                and real-time connectivity - bringing the power of AI directly into daily experiences.
              </p>
            </motion.div>

            <motion.div
              className="space-y-3 rounded-3xl "
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-xl font-semibold text-white">Our Product</h3>
              <p>EchoLens is our flagship AI smart eyewear, designed to redefine visual interaction:</p>
              <p>
                Lens S1 - Designed for the spectacles category, combining comfort with advanced AI features for
                daily wear.
              </p>
              <p>
                Lens G1 - Built for the goggles category, offering enhanced immersive and functional capabilities.
              </p>
              <p>
                Each product is engineered to deliver seamless AI assistance while maintaining elegant, practical
                design.
              </p>
            </motion.div>

            <motion.div
              className="space-y-3 rounded-3xl "
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-white">Corporate Information</h3>
              <p>The EchoMinds operates under Lefflex LLP.</p>
              <p>
                Lefflex LLP
                <br />
                Palam Vihar Extension
                <br />
                Gurugram, Haryana - 122017
                <br />
                India
              </p>
              <p>LLP Identification Number (LLPIN): ACQ-2686</p>
              <p>Founder: Piyush Karn</p>
              <p>
                Email:{" "}
                <a className="text-white hover:underline" href="mailto:piyushkarn@lefflex.com">
                  piyushkarn@lefflex.com
                </a>
              </p>
            </motion.div>

            <motion.div
              className="space-y-3 rounded-3xl "
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-white">Contact Us</h3>
              <p>
                For general inquiries:{" "}
                <a className="text-white hover:underline" href="mailto:contact@theechominds.com">
                  contact@theechominds.com
                </a>
              </p>
              <p>
                For administrative queries:{" "}
                <a className="text-white hover:underline" href="mailto:admin@theechominds.com">
                  admin@theechominds.com
                </a>
              </p>
            </motion.div>
          </div>
        </section>

        <footer className="py-8 px-6 text-center text-gray-400 border-t border-zinc-800 bg-black/30">
          Copyright {new Date().getFullYear()} TheEchoMinds. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
