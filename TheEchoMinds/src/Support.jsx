import PageBackground from "@/components/PageBackground.jsx";
import SiteFooter from "@/components/SiteFooter.jsx";
import SiteSubpageHeader from "@/components/SiteSubpageHeader.jsx";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";

export default function SupportPage() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="relative min-h-screen text-white">
      <PageBackground />

      <div className="relative z-10">
        <SiteSubpageHeader
          leading={
            <h1 className="text-lg md:text-xl font-semibold tracking-wide text-white">Support Center</h1>
          }
        />

        {/* Content */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto space-y-10 text-sm md:text-base text-gray-300">

            {/* Title */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl font-semibold text-white">
                Support Center
              </h2>
              <p>
                Need help with EchoLens or our services? We’re here to assist you
                with setup, troubleshooting, and general inquiries.
              </p>
              <p className="pt-2">
                {isLoggedIn ? (
                  <Link to="/help-centre" className="text-cyan-400 hover:underline">
                    Help Centre — complaints, repairs, and formal requests (uses your account details)
                  </Link>
                ) : (
                  <>
                    <span className="text-zinc-500">Help Centre (sign in required): </span>
                    <Link to="/login" state={{ redirectTo: "/help-centre" }} className="text-cyan-400 hover:underline">
                      Sign in to open Help Centre
                    </Link>
                  </>
                )}
              </p>
            </motion.div>

            {/* FAQ */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-xl font-semibold text-white">Common Questions</h3>

              <div className="space-y-3">
                <p><strong>How do I set up EchoLens?</strong></p>
                <p>Power on your device and connect via the mobile app. Follow the onboarding steps shown in-app.</p>

                <p><strong>Does EchoLens work offline?</strong></p>
                <p>Basic features work offline, but AI-powered capabilities require internet connectivity.</p>

                <p><strong>How do I update my device?</strong></p>
                <p>Updates are pushed via the app. Ensure your device is connected and has sufficient battery.</p>
              </div>
            </motion.div>

            {/* Contact Support */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-white">Contact Support</h3>

              <p>
                Technical Support:{" "}
                <a href="mailto:support@theechominds.com" className="text-white hover:underline">
                  support@theechominds.com
                </a>
              </p>

              <p>
                General Queries:{" "}
                <a href="mailto:contact@theechominds.com" className="text-white hover:underline">
                  contact@theechominds.com
                </a>
              </p>
            </motion.div>

            {/* Troubleshooting */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-white">Troubleshooting</h3>

              <ul className="list-disc list-inside space-y-2">
                <li>Restart your device if it becomes unresponsive</li>
                <li>Ensure stable internet for AI features</li>
                <li>Check app permissions for camera/microphone</li>
                <li>Update firmware regularly</li>
              </ul>
            </motion.div>

          </div>
        </section>

        <SiteFooter className="mt-8" />
      </div>
    </div>
  );
}