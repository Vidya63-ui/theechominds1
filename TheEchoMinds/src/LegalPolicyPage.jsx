import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";

const LAST_UPDATED = "March 24, 2026";

function Section({ title, children, delay = 0 }) {
  return (
    <motion.section
      className="space-y-3 rounded-3xl"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <h2 className="text-xl md:text-2xl font-semibold text-white">{title}</h2>
      <div className="space-y-3 text-sm md:text-base text-gray-300 leading-relaxed">{children}</div>
    </motion.section>
  );
}

export default function LegalPolicyPage() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  return (
    <div className="relative min-h-screen text-white">
      <div className="fixed inset-0 z-0 overflow-hidden blur-md">
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
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 flex-wrap">
            <h1 className="text-lg md:text-xl font-semibold tracking-wide">The EchoMinds</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <Button variant="outline" className="rounded-full" onClick={() => navigate("/")}>
                Home
              </Button>
              <Button variant="outline" className="rounded-full" onClick={() => navigate("/about")}>
                About
              </Button>
              <Button className="rounded-full" onClick={() => navigate("/privacy-policy")}>
                Privacy
              </Button>
              {isLoggedIn && (
                <Button variant="outline" className="rounded-full" onClick={() => logout(navigate)}>
                  Logout
                </Button>
              )}
            </div>
          </div>
        </header>

        <article className="py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-12">
            <motion.div
              className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-8 md:p-10 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <h1 className="text-2xl md:text-4xl font-semibold text-white tracking-tight">Privacy Policy</h1>
              <p className="text-gray-400 text-sm md:text-base">
                for <span className="text-white font-medium">EchoLens</span> (“the App”)
              </p>
              <dl className="grid gap-2 text-sm md:text-base text-gray-300 pt-2 border-t border-white/10">
                <div>
                  <dt className="text-gray-500 text-xs uppercase tracking-wide">Last updated</dt>
                  <dd>{LAST_UPDATED}</dd>
                </div>
                <div>
                  <dt className="text-gray-500 text-xs uppercase tracking-wide">Operated by</dt>
                  <dd>Lefflex LLP</dd>
                </div>
                <div>
                  <dt className="text-gray-500 text-xs uppercase tracking-wide">Contact</dt>
                  <dd>
                    <a className="text-white hover:underline" href="mailto:privacy@theechominds.com">
                    contact@theechominds.com
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500 text-xs uppercase tracking-wide">Registered office</dt>
                  <dd>
                    Palam Vihar Extension, Gurugram, Haryana 122017, India
                    <span className="block text-gray-400 text-sm mt-1">LLPIN: ACQ-2686</span>
                  </dd>
                </div>
              </dl>
            </motion.div>

            <div className="space-y-10">
              <Section title="1. Who we are" delay={0.05}>
                <p>
                  Lefflex LLP operates the App under the EchoMinds brand, and this website where this policy is
                  published. This policy explains how we handle information when you use the App.
                </p>
              </Section>

              <Section title="2. Information we collect" delay={0.08}>
                <h3 className="text-lg font-medium text-white pt-1">2.1 You provide</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-gray-200 font-medium">Account:</strong> name, email address, phone number,
                    and password. Passwords are stored using secure hashing; we do not store your password in plain
                    text.
                  </li>
                  <li>
                    <strong className="text-gray-200 font-medium">Verification:</strong> one-time codes sent to your
                    email or phone when needed to verify your identity or sign-in.
                  </li>
                  <li>
                    <strong className="text-gray-200 font-medium">Orders and payments:</strong> preorder and order
                    details, shipping and contact information you submit, and payment-related information you provide
                    (for example transaction references or proof you upload through our services). We do not store
                    full card numbers on our servers; any card processing is handled by the payment provider you use,
                    under that provider&apos;s terms and privacy policy.
                  </li>
                </ul>
                <h3 className="text-lg font-medium text-white pt-4">2.2 Automatically</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-gray-200 font-medium">Device and app:</strong> device type, operating
                    system version, app version, and diagnostic or crash data if you use crash reporting, so we can
                    improve stability.
                  </li>
                  <li>
                    <strong className="text-gray-200 font-medium">Network:</strong> IP address and basic request
                    metadata when the App communicates with our servers or APIs.
                  </li>
                </ul>
                <h3 className="text-lg font-medium text-white pt-4">2.3 Optional / device permissions</h3>
                <p>Depending on the features you use, the App may request access to:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-gray-200 font-medium">Bluetooth / nearby devices:</strong> to pair and
                    connect with compatible EchoLens glasses and accessories.
                  </li>
                  <li>
                    <strong className="text-gray-200 font-medium">Location:</strong> only if a feature you enable
                    requires it; we will describe the purpose in the system permission prompt.
                  </li>
                  <li>
                    <strong className="text-gray-200 font-medium">Camera, photos, or storage:</strong> only if you use
                    features that need them (for example capturing or saving content); purposes are described when
                    permission is requested.
                  </li>
                </ul>
                <p className="text-gray-400 text-sm">
                  We collect only what is needed for the features you use. If a permission is not required for a
                  feature, we do not ask for it.
                </p>
              </Section>

              <Section title="3. How we use information" delay={0.1}>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Create and secure your account, and send verification and transactional messages.</li>
                  <li>Process preorders, orders, and payments.</li>
                  <li>Provide customer support.</li>
                  <li>Improve reliability, performance, and security of the App and our services.</li>
                  <li>Comply with applicable law and respond to lawful requests.</li>
                </ul>
                <p>We do not sell your personal information.</p>
              </Section>

              <Section title="4. Legal bases (if applicable)" delay={0.12}>
                <p>
                  Where laws such as the GDPR apply, we rely on: performance of a contract (providing the App and
                  related services); legitimate interests (for example security, fraud prevention, and service
                  improvement), balanced against your rights; consent where required (for example certain optional
                  notifications or analytics); and legal obligation where we must retain or disclose information.
                </p>
              </Section>

              <Section title="5. Sharing" delay={0.14}>
                <p>We may share data with:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Service providers who help us operate the App (such as hosting, email or SMS delivery, payments,
                    and analytics), only as needed to perform services for us and under appropriate confidentiality
                    and security terms.
                  </li>
                  <li>Competent authorities when required by law or to protect rights and safety.</li>
                </ul>
                <p>We do not share your password with third parties.</p>
              </Section>

              <Section title="6. International transfers" delay={0.16}>
                <p>
                  Our servers and subprocessors may be located in India and in other countries where our providers
                  operate. If personal data is transferred across borders, we use safeguards required by applicable law
                  (such as appropriate contractual clauses or equivalent mechanisms, where required). Details can be
                  provided on request.
                </p>
              </Section>

              <Section title="7. Retention" delay={0.18}>
                <p>
                  We keep account and order-related data for as long as your account is active and as needed to meet
                  legal, tax, accounting, and dispute-resolution requirements. Verification codes are kept only for a
                  short time. You may request deletion as described below.
                </p>
              </Section>

              <Section title="8. Security" delay={0.2}>
                <p>
                  We use industry-standard measures, including encryption in transit where appropriate, access controls,
                  and secure password handling. No method of transmission or storage is completely secure; we work to
                  protect your information but cannot guarantee absolute security.
                </p>
              </Section>

              <Section title="9. Your choices and rights" delay={0.22}>
                <p>
                  Depending on where you live, you may have rights to access, correct, delete, or export your personal
                  data, and to object to or restrict certain processing. To exercise these rights, contact{" "}
                  <a className="text-white hover:underline" href="mailto:privacy@theechominds.com">
                    privacy@theechominds.com
                  </a>
                  . We may need to verify your identity before fulfilling a request.
                </p>
                <p>
                  You can stop using the App at any time. To request account deletion, email{" "}
                  <a className="text-white hover:underline" href="mailto:privacy@theechominds.com">
                    privacy@theechominds.com
                  </a>{" "}
                  from the address associated with your account, or use any in-app account deletion option if we
                  provide one. We will complete deletion subject to legal retention requirements.
                </p>
              </Section>

              <Section title="10. Children" delay={0.24}>
                <p>
                  The App is not directed at children under 13. We do not knowingly collect personal information from
                  children under 13. If you believe we have collected information from a child, please contact us at{" "}
                  <a className="text-white hover:underline" href="mailto:privacy@theechominds.com">
                    privacy@theechominds.com
                  </a>{" "}
                  so we can take appropriate steps.
                </p>
              </Section>

              <Section title="11. Third-party services" delay={0.26}>
                <p>
                  The App or our website may link to or embed third-party services (for example payment, maps, or
                  analytics). Those services are governed by their own terms and privacy policies. We encourage you to
                  read them when you use those features.
                </p>
              </Section>

              <Section title="12. Changes" delay={0.28}>
                <p>
                  We may update this policy from time to time. We will post the updated version on this page with a new
                  “Last updated” date. Where required by law, we may also notify you through the App or by email.
                </p>
              </Section>

              <Section title="13. Contact" delay={0.3}>
                <p>
                  Questions or requests about this policy or your personal data:{" "}
                  <a className="text-white hover:underline" href="mailto:privacy@theechominds.com">
                  admin@theechominds.com
                  </a>
                </p>
                <p className="text-gray-400 text-sm">
                  General inquiries:{" "}
                  <a className="text-white hover:underline" href="mailto:contact@theechominds.com">
                    contact@theechominds.com
                  </a>
                </p>
              </Section>
            </div>

            <p className="text-center text-gray-500 text-sm pb-4">
              <Link to="/" className="text-gray-400 hover:text-white hover:underline">
                Back to home
              </Link>
            </p>
          </div>
        </article>

        <footer className="py-8 px-6 text-center text-gray-400 border-t border-zinc-800 bg-black/30">
          <div className="max-w-6xl mx-auto flex flex-col items-center gap-2">
            <Link to="/privacy-policy" className="text-sm text-gray-500 hover:text-white hover:underline">
              Privacy Policy
            </Link>
            <p>Copyright {new Date().getFullYear()} TheEchoMinds. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
