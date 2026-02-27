import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function HowItWorksPage() {
  const navigate = useNavigate();

  const steps = [
    {
      title: "Capture",
      desc: "EchoLens cameras and sensors observe your surroundings in real time with low-latency vision processing.",
    },
    {
      title: "Understand",
      desc: "On-device AI interprets context such as objects, text, language, and spatial cues while preserving privacy.",
    },
    {
      title: "Assist",
      desc: "You receive results through subtle visual overlays, voice prompts, and contextual guidance without breaking flow.",
    },
  ];

  return (
    <div className="relative min-h-screen text-white">
      <div className="fixed inset-0 z-0 overflow-hidden">
        <video autoPlay loop muted playsInline className="h-full w-full object-cover saturate-125">
          <source src="/videos/4753-179739298_medium.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/75" />
      </div>

      <div className="relative z-10">
        <header className="sticky top-0 z-20 px-6 py-4 border-b border-white/10 bg-black/30 backdrop-blur-md">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <h1 className="text-lg md:text-xl font-semibold tracking-wide">How EchoLens Works</h1>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-full" onClick={() => navigate("/")}>
                Home
              </Button>
              <Button className="rounded-full" onClick={() => navigate("/preorder")}>
                Pre-order
              </Button>
            </div>
          </div>
        </header>

        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-semibold tracking-tight mb-6"
            >
              Product Workflow
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-300 max-w-3xl text-lg"
            >
              EchoLens is designed for real-world use: sense, process, and assist in seconds. Below is the core flow
              your users experience every day.
            </motion.p>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((step, idx) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.12 }}
                  className="rounded-3xl border border-white/15 bg-black/40 backdrop-blur-md p-7"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Step 0{idx + 1}</p>
                  <h3 className="text-2xl font-semibold mt-3 mb-3">{step.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
