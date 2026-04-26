import PageBackground from "@/components/PageBackground.jsx";
import SiteSubpageHeader from "@/components/SiteSubpageHeader.jsx";
import { motion } from "framer-motion";

export default function HowItWorksPage() {

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
      <PageBackground />

      <div className="relative z-10">
        <SiteSubpageHeader
          leading={
            <h1 className="text-lg md:text-xl font-semibold tracking-wide text-white">How EchoLens Works</h1>
          }
        />

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
