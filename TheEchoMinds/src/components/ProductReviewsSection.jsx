import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, PenLine, X, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext.jsx";
import { apiFetch } from "@/lib/api";
import { getDisplayReviews, addProductReview } from "@/lib/productReviews.js";
import { hasDeliveredOrderForProduct } from "@/lib/orderReviewEligibility.js";

function Stars({ value, onChange, readOnly = false }) {
  const inner = [1, 2, 3, 4, 5].map((n) => (
    <Star
      key={n}
      className={`h-5 w-5 ${
        n <= value ? "fill-amber-400 text-amber-400" : "fill-zinc-700 text-zinc-600"
      }`}
      strokeWidth={readOnly && n > value ? 1.2 : 1.5}
    />
  ));

  if (readOnly) {
    return (
      <div className="flex items-center gap-0.5" role="img" aria-label={`${value} out of 5 stars`}>
        {inner}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          className="p-0.5 rounded-md hover:bg-white/10 transition -m-0.5"
          aria-label={`Rate ${n} out of 5 stars`}
        >
          <Star
            className={`h-5 w-5 ${
              n <= value ? "fill-amber-400 text-amber-400" : "fill-zinc-700 text-zinc-600"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function averageRating(reviews) {
  if (!reviews.length) return 0;
  const sum = reviews.reduce((a, r) => a + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

/**
 * @param {{ productId: string, productTitle: string }} props
 */
export default function ProductReviewsSection({ productId, productTitle }) {
  const { user, isLoggedIn } = useAuth();
  const [list, setList] = useState(() => getDisplayReviews(productId));
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const canPostReview = useMemo(
    () => isLoggedIn && hasDeliveredOrderForProduct(orders, productId),
    [isLoggedIn, orders, productId]
  );

  const reload = useCallback(() => {
    setList(getDisplayReviews(productId));
  }, [productId]);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    if (user?.name) setName(user.name);
    else if (user?.email) setName(user.email.split("@")[0]);
  }, [user]);

  useEffect(() => {
    if (!isLoggedIn) {
      setOrders([]);
      setOrdersLoading(false);
      return;
    }
    setOrdersLoading(true);
    let cancelled = false;
    apiFetch("/orders/me")
      .then((d) => {
        if (!cancelled) setOrders(d.orders || []);
      })
      .catch(() => {
        if (!cancelled) setOrders([]);
      })
      .finally(() => {
        if (!cancelled) setOrdersLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (!canPostReview) setShowForm(false);
  }, [canPostReview]);

  const stats = useMemo(() => {
    const avg = averageRating(list);
    return { avg, count: list.length };
  }, [list]);

  const closeForm = () => {
    setShowForm(false);
    setSubmitted(false);
    setText("");
    setRating(5);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canPostReview || !text.trim() || text.trim().length < 3) return;
    addProductReview(productId, { name: name.trim() || "Anonymous", rating, text: text.trim() });
    setText("");
    setSubmitted(true);
    reload();
    setTimeout(() => {
      setSubmitted(false);
      closeForm();
    }, 1800);
  };

  return (
    <section className="pb-20 px-4 sm:px-6" aria-labelledby="product-reviews-heading">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-60px" }}
          >
            <h2 id="product-reviews-heading" className="text-2xl md:text-3xl font-medium mb-2">
              Customer reviews
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-xl">
              Scroll sideways to read reviews. You can add yours after this product is marked delivered in
              your order.
            </p>
          </motion.div>

          <div className="flex flex-wrap items-center gap-3 sm:justify-end">
            {stats.count > 0 && (
              <div
                className="flex items-baseline gap-2"
                aria-label={`${stats.avg} out of 5, ${stats.count} reviews`}
              >
                <span className="text-3xl font-semibold text-white tabular-nums">
                  {stats.avg.toFixed(1)}
                </span>
                <div className="flex flex-col">
                  <Stars value={Math.round(stats.avg)} readOnly />
                  <span className="text-xs text-zinc-500 mt-0.5">
                    {stats.count} review{stats.count === 1 ? "" : "s"}
                  </span>
                </div>
              </div>
            )}

            {canPostReview && (
              <Button
                type="button"
                variant={showForm ? "secondary" : "default"}
                className="rounded-full gap-2 shrink-0"
                onClick={() => (showForm ? closeForm() : setShowForm(true))}
                aria-expanded={showForm}
                aria-controls="product-review-form"
              >
                {showForm ? (
                  <>
                    <X className="h-4 w-4" />
                    Close
                  </>
                ) : (
                  <>
                    <PenLine className="h-4 w-4" />
                    Write a review
                  </>
                )}
              </Button>
            )}

            {!canPostReview && !ordersLoading && (
              <div
                className="flex items-center gap-2 text-xs text-zinc-500 max-w-xs sm:max-w-none sm:text-right"
                role="status"
              >
                <Lock className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden />
                {isLoggedIn ? (
                  <span>
                    Reviews open after a{" "}
                    <strong className="text-zinc-300">delivered</strong> order for {productTitle}. Mark
                    your package as delivered in{" "}
                    <Link to="/dashboard" className="text-cyan-400 hover:underline">
                      My profile
                    </Link>
                    .
                  </span>
                ) : (
                  <span>
                    <Link to="/login" className="text-cyan-400 hover:underline">
                      Sign in
                    </Link>{" "}
                    and confirm delivery on your order to post a review.
                  </span>
                )}
              </div>
            )}

            {ordersLoading && isLoggedIn && (
              <span className="inline-flex items-center gap-2 text-xs text-zinc-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Checking orders…
              </span>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showForm && canPostReview && (
            <motion.form
              id="product-review-form"
              onSubmit={handleSubmit}
              className="bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-white/15 p-6 md:p-8 mb-8"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <p className="text-sm text-white/90 font-medium">Submit your review</p>
                <button
                  type="button"
                  onClick={closeForm}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition -mr-1 -mt-1"
                  aria-label="Close review form"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="review-name" className="block text-xs text-zinc-500 mb-1.5">
                    Name (optional)
                  </label>
                  <input
                    id="review-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl bg-zinc-950/80 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/20"
                    placeholder="How should we show your name?"
                    maxLength={80}
                  />
                </div>
                <div>
                  <span className="block text-xs text-zinc-500 mb-1.5">Rating</span>
                  <Stars value={rating} onChange={setRating} />
                </div>
                <div>
                  <label htmlFor="review-text" className="block text-xs text-zinc-500 mb-1.5">
                    Your review
                  </label>
                  <textarea
                    id="review-text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                    minLength={3}
                    maxLength={2000}
                    rows={4}
                    className="w-full rounded-xl bg-zinc-950/80 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/20 resize-y min-h-[100px]"
                    placeholder="What worked well? What would you improve?"
                  />
                </div>
                {submitted && (
                  <p className="text-sm text-emerald-400" role="status">
                    Thanks — your review was posted.
                  </p>
                )}
                <div className="flex flex-wrap gap-3">
                  <Button type="submit" className="rounded-full" disabled={text.trim().length < 3}>
                    Submit review
                  </Button>
                  <Button type="button" variant="outline" className="rounded-full" onClick={closeForm}>
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {list.length === 0 ? (
          <p className="text-sm text-zinc-500">No reviews to show yet.</p>
        ) : (
          <div
            className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            role="list"
            aria-label="Review cards, scroll horizontally"
          >
            {list.map((r) => (
              <motion.article
                key={r.id}
                className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 p-5 w-[min(100%,18rem)] sm:w-80 flex-shrink-0 snap-start flex flex-col"
                role="listitem"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                viewport={{ once: true, margin: "-20px" }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <p className="font-medium text-white text-sm truncate">{r.name}</p>
                    {r.demo && (
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500 border border-zinc-600/80 rounded px-1.5 py-0.5 shrink-0">
                        Sample
                      </span>
                    )}
                  </div>
                  <time className="text-xs text-zinc-500 shrink-0" dateTime={r.createdAt}>
                    {new Date(r.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <Stars value={r.rating} readOnly />
                <p className="mt-3 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap flex-1">
                  {r.text}
                </p>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
