import { Button } from "@/components/ui/button";
import PageBackground from "@/components/PageBackground.jsx";
import SiteFooter from "@/components/SiteFooter.jsx";
import SiteSubpageHeader from "@/components/SiteSubpageHeader.jsx";
import { motion } from "framer-motion";

export default function AppPage() {

  return (
    <div className="relative min-h-screen text-white">
      <PageBackground />

      <div className="relative z-10">
        <SiteSubpageHeader leading={<h1 className="text-lg md:text-xl font-semibold tracking-wide text-white">App</h1>} />

        {/* Content */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto space-y-12 text-gray-300">

            {/* Title */}
            <motion.div
              className="space-y-4 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-white">
                EchoLens Mobile App
              </h2>
              <p className="max-w-2xl mx-auto">
                The EchoLens app is your control hub for managing your smart glasses,
                customizing AI features, and accessing real-time insights seamlessly.
              </p>
            </motion.div>

            {/* Features */}
            <motion.div
              className="grid md:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {[
                "Device pairing & setup",
                "Real-time AI controls",
                "Firmware updates",
                "Voice & gesture customization",
                "Usage analytics",
                "Cloud sync & backup"
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6"
                >
                  <p className="text-white">{item}</p>
                </div>
              ))}
            </motion.div>

            {/* Play Store Section */}
            <motion.div
              className="bg-black/50 backdrop-blur-md border border-white/10 rounded-3xl p-10 text-center space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-2xl font-semibold text-white">
                Get the App
              </h3>
              <p>
                Download the EchoLens app on Android and start experiencing
                seamless AI integration with your device.
              </p>

              <Button
                className="rounded-full px-8 py-5 text-base"
                onClick={() =>
                  window.open(
                    "https://play.google.com/store/apps/details?id=com.theechominds.app",
                    "_blank"
                  )
                }
              >
                Download on Play Store
              </Button>
            </motion.div>

          </div>
        </section>

        <SiteFooter className="mt-8" />
      </div>
    </div>
  );
}