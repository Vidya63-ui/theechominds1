import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

/**
 * @param {{ productTitle?: string, faqs: { q: string, a: string }[] }} props
 */
export default function ProductFaqSection({ productTitle = "this product", faqs = [] }) {
  if (!faqs.length) return null;

  return (
    <section className="pb-20 px-6" aria-labelledby="product-faq-heading">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-60px" }}
        >
          <h2 id="product-faq-heading" className="text-2xl md:text-3xl font-medium mb-2">
            Questions about {productTitle}
          </h2>
          <p className="text-gray-400 text-sm md:text-base mb-8">
            Quick answers about compatibility, care, and orders. For more help, contact us from the
            footer.
          </p>
        </motion.div>
        <div className="space-y-3">
          {faqs.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              viewport={{ once: true, margin: "-40px" }}
            >
              <details className="group bg-black/50 backdrop-blur-md rounded-2xl border border-white/10 open:border-white/20">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-white font-medium marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="pr-2">{item.q}</span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-zinc-500 transition group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-4 text-sm text-gray-300 leading-relaxed border-t border-white/5 pt-3">
                  {item.a}
                </div>
              </details>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
