import { useState } from "react";
import { Button } from "@/components/ui/button";
import PageBackground from "@/components/PageBackground.jsx";
import SiteFooter from "@/components/SiteFooter.jsx";
import SiteSubpageHeader from "@/components/SiteSubpageHeader.jsx";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api.js";
import { Loader2 } from "lucide-react";

const ENQUIRY_TYPES = [
  {
    id: "investment",
    title: "Investment / funding",
    description: "Institutional or angel interest in TheEchoMinds Pvt. Ltd.",
  },
  {
    id: "partnership",
    title: "Strategic partnership",
    description: "Distribution, technology, or go-to-market collaboration.",
  },
  {
    id: "media_other",
    title: "Media or other",
    description: "Press, events, or general corporate questions.",
  },
];

const initialForm = {
  name: "",
  email: "",
  organisation: "",
  enquiryType: "",
  message: "",
};

export default function CompanyInvestorRelationsPage() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("submitting");
    try {
      await apiFetch("/investor-enquiries", {
        method: "POST",
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          organisation: form.organisation.trim(),
          enquiryType: form.enquiryType,
          message: form.message.trim(),
        }),
      });
      setStatus("success");
      setForm(initialForm);
    } catch (err) {
      setStatus("idle");
      setError(err?.message || "Something went wrong. You can still email us using the link below.");
    }
  };

  const mailtoFallback = () => {
    const subject = encodeURIComponent("Investor relations inquiry");
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nOrganisation: ${form.organisation}\nType: ${form.enquiryType}\n\n${form.message}`,
    );
    window.location.href = `mailto:contact@theechominds.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="relative min-h-screen text-white">
      <PageBackground />

      <div className="relative z-10">
        <SiteSubpageHeader
          leading={
            <h1 className="text-lg md:text-xl font-semibold tracking-wide text-white">
              Company &amp; investor relations
            </h1>
          }
        />

        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto space-y-10 text-sm md:text-base text-gray-300">
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/45">Disclosure &amp; governance</p>
              <h2 className="text-2xl md:text-3xl font-semibold text-white">Company &amp; investor relations</h2>
              <p>
                The EchoMinds operates as a consumer brand of{" "}
                <span className="text-zinc-200">TheEchoMinds Pvt. Ltd.</span>, focused on AI-integrated wearable devices
                including EchoLens. This page summarises how we engage with stakeholders on corporate structure and
                investment-related topics.
              </p>
            </motion.div>

            <motion.div
              className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
            >
              <h3 className="text-xl font-semibold text-white">Corporate information</h3>
              <ul className="space-y-2 list-none">
                <li>
                  <span className="text-zinc-500">Legal name:</span> TheEchoMinds Pvt. Ltd. (The EchoMinds)
                </li>
                <li>
                  <span className="text-zinc-500">Registered office:</span> Madhapur, Hyderabad, Telangana, India
                </li>
                <li>
                  <span className="text-zinc-500">CIN:</span> U62090TS2026PTC215177
                </li>
                <li>
                  <span className="text-zinc-500">General contact:</span>{" "}
                  <a
                    href="mailto:contact@theechominds.com"
                    className="text-cyan-300/90 hover:text-cyan-200 underline underline-offset-2"
                  >
                    contact@theechominds.com
                  </a>
                </li>
              </ul>
            </motion.div>

            <motion.div
              className="rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-white/[0.06] to-zinc-950/80 p-6 sm:p-8 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.5)]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
            >
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-400/80 mb-2">Investors</p>
              <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">Send us an enquiry</h3>
              <p className="mt-2 text-sm text-zinc-400 max-w-2xl leading-relaxed">
                Share a few details and we will route your message to the right team. No account required.
              </p>

              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-6 text-emerald-100/95"
                >
                  <p className="font-medium text-white">Thank you — we have received your enquiry.</p>
                  <p className="mt-2 text-sm text-emerald-100/80">
                    We review messages on a rolling basis and will reply when there is a fit.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-5 rounded-full border-white/20 text-white hover:bg-white/10"
                    onClick={() => setStatus("idle")}
                  >
                    Send another message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="ir-name" className="block text-xs font-medium uppercase tracking-wider text-zinc-500 mb-2">
                        Name
                      </label>
                      <input
                        id="ir-name"
                        type="text"
                        autoComplete="name"
                        required
                        value={form.name}
                        onChange={(e) => setField("name", e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="ir-email" className="block text-xs font-medium uppercase tracking-wider text-zinc-500 mb-2">
                        Work email
                      </label>
                      <input
                        id="ir-email"
                        type="email"
                        autoComplete="email"
                        required
                        value={form.email}
                        onChange={(e) => setField("email", e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                        placeholder="you@company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="ir-org" className="block text-xs font-medium uppercase tracking-wider text-zinc-500 mb-2">
                      Organisation <span className="text-zinc-600 normal-case font-normal">(optional)</span>
                    </label>
                    <input
                      id="ir-org"
                      type="text"
                      value={form.organisation}
                      onChange={(e) => setField("organisation", e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                      placeholder="Fund, company, or affiliation"
                    />
                  </div>

                  <div>
                    <p className="block text-xs font-medium uppercase tracking-wider text-zinc-500 mb-3">Enquiry type</p>
                    <ul className="grid gap-2.5 sm:grid-cols-3">
                      {ENQUIRY_TYPES.map((opt) => (
                        <li key={opt.id}>
                          <button
                            type="button"
                            onClick={() => setField("enquiryType", opt.id)}
                            className={`w-full text-left rounded-xl border px-4 py-3.5 transition-all duration-200 ${
                              form.enquiryType === opt.id
                                ? "border-cyan-400/50 bg-cyan-500/10 ring-1 ring-cyan-400/25"
                                : "border-white/10 bg-white/[0.03] hover:border-white/20"
                            }`}
                          >
                            <span className="block text-sm font-semibold text-white">{opt.title}</span>
                            <span className="block text-[11px] text-zinc-500 mt-1 leading-snug">{opt.description}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <label htmlFor="ir-message" className="block text-xs font-medium uppercase tracking-wider text-zinc-500 mb-2">
                      Message
                    </label>
                    <textarea
                      id="ir-message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setField("message", e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 resize-y min-h-[120px]"
                      placeholder="Brief context: mandate, timeline, geography, and what you would like to explore."
                    />
                    <p className="mt-1.5 text-[11px] text-zinc-600">At least 20 characters.</p>
                  </div>

                  {error && <p className="text-sm text-rose-300">{error}</p>}

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                    <Button
                      type="submit"
                      disabled={status === "submitting" || !form.enquiryType}
                      className="rounded-full px-8 py-6 bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-50"
                    >
                      {status === "submitting" ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                          Sending…
                        </span>
                      ) : (
                        "Submit enquiry"
                      )}
                    </Button>
                    <button
                      type="button"
                      onClick={mailtoFallback}
                      className="text-xs text-zinc-500 hover:text-zinc-400 underline underline-offset-2 text-left sm:text-center"
                    >
                      Prefer email? Open in your mail app instead
                    </button>
                  </div>
                </form>
              )}
            </motion.div>

            <motion.div
              className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <h3 className="text-xl font-semibold text-white">Investor relations</h3>
              <p>
                For institutional investors, strategic partners, and diligence requests related to TheEchoMinds Pvt. Ltd. /
                The EchoMinds, please use the form above or reach out by email with a short description of your
                organisation and the nature of your inquiry.
              </p>
              <p>
                <span className="text-zinc-500">Investor &amp; partnership inquiries:</span>{" "}
                <a
                  href="mailto:contact@theechominds.com?subject=Investor%20relations%20inquiry"
                  className="text-cyan-300/90 hover:text-cyan-200 underline underline-offset-2"
                >
                  contact@theechominds.com
                </a>{" "}
                <span className="text-zinc-500">(subject: Investor relations inquiry)</span>
              </p>
              <p className="text-xs text-zinc-500 leading-relaxed pt-2 border-t border-white/10">
                Nothing on this page constitutes an offer to sell or a solicitation to buy any security. Forward-looking
                statements about products, timelines, or markets are subject to risks and uncertainties; actual results may
                differ. Past performance of any business line is not indicative of future results.
              </p>
            </motion.div>

            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22 }}
            >
              <h3 className="text-xl font-semibold text-white">Reporting &amp; policies</h3>
              <p>
                Consumer-facing policies (privacy, terms, warranty, shipping, and repair) are linked in the site footer and
                apply to purchases and services through our official channels.
              </p>
            </motion.div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}
