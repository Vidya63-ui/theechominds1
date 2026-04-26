import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Glasses, Usb, Sparkles, FileText, ShieldCheck } from "lucide-react";

const iconClass = "h-5 w-5 text-cyan-400/90 shrink-0 mt-0.5";

/**
 * @param {{
 *   productName: string,
 *   description: string,
 *   inBox: { label: string, sub?: string, icon: 'device' | 'usb' | 'cloth' | 'warranty' }[],
 *   className?: string
 * }} props
 */
export default function ProductAboutAndInBox({ productName, description, inBox, className = "" }) {
  const Icon = ({ type }) => {
    switch (type) {
      case "usb":
        return <Usb className={iconClass} strokeWidth={1.75} />;
      case "cloth":
        return <Sparkles className={iconClass} strokeWidth={1.75} />;
      case "warranty":
        return <FileText className={iconClass} strokeWidth={1.75} />;
      default:
        return <Glasses className={iconClass} strokeWidth={1.75} />;
    }
  };

  return (
    <section className={`py-12 sm:py-16 ${className}`}>
      <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-2">
        <motion.div
          className="rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900/80 to-black/50 p-6 sm:p-8 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-lg font-semibold text-white/95 tracking-tight">About {productName}</h2>
          <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed">{description}</p>
        </motion.div>

        <motion.div
          className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-6 sm:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <h2 className="text-lg font-semibold text-white/95">In the box</h2>
          <p className="text-xs text-zinc-500 mt-1 mb-5">Every retail kit includes the following:</p>
          <ul className="space-y-4">
            {inBox.map((row) => (
              <li key={row.label} className="flex gap-3">
                <Icon type={row.icon} />
                <div>
                  <p className="text-sm font-medium text-zinc-200">{row.label}</p>
                  {row.sub && <p className="text-xs text-zinc-500 mt-0.5">{row.sub}</p>}
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <motion.div
        className="mt-6 max-w-6xl mx-auto rounded-3xl border border-emerald-500/25 bg-gradient-to-r from-emerald-950/50 via-emerald-950/30 to-zinc-900/40 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45, delay: 0.1 }}
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-400/30">
          <ShieldCheck className="h-6 w-6 text-emerald-300" strokeWidth={1.75} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-emerald-100/95">1 year limited warranty</h3>
          <p className="text-sm text-zinc-400 mt-1 max-w-3xl">
            Hardware is covered for one year from purchase against defects in materials and workmanship under
            normal use. See the printed warranty card in the box and our{" "}
            <Link to="/warranty-policy" className="text-cyan-400 hover:underline">
              warranty policy
            </Link>{" "}
            online. Keep your invoice and warranty card for support.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
