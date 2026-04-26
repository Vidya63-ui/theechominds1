import PageBackground from "@/components/PageBackground.jsx";
import SiteFooter from "@/components/SiteFooter.jsx";
import SiteSubpageHeader from "@/components/SiteSubpageHeader.jsx";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen text-white">
      <PageBackground />

      <div className="relative z-10">
        <SiteSubpageHeader
          leading={<h1 className="text-lg md:text-xl font-semibold tracking-wide text-white">About</h1>}
        />

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
              <p>The EchoMinds is the consumer brand of TheEchoMinds Pvt. Ltd.</p>
              <p>
                Registered Office :
                <br />
                Madhapur
                <br />
                Hyderabad, Telangana
                <br />
                India
              </p>
              <br />
              <p>
                Assembly Unit And Warehouse :
                <br />
                Devanahalli, Southegowdanahalli
                <br />
                Bangalore, Karnataka 562110
                <br />
                India
              </p>
              <br/>
              <p>Corporate Identity Number (CIN): U62090TS2026PTC215177</p>
              <br />
              <p>Founder: Piyush Karn</p>
              <p>
                Email:{" "}
                <a className="text-white hover:underline" href="mailto:piyushkarn@lefflex.com">
                  piyushkarn@lefflex.com
                </a>
              </p>
              <br />
              <p>Co-Founder: Rishav Raj</p>
              <p>
                Email:{" "}
                <a className="text-white hover:underline" href="mailto:rishav@theechominds.com">
                  rishav@theechominds.com
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

        <SiteFooter className="mt-8" />
      </div>
    </div>
  );
}
