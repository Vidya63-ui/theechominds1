import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addOrUpdateLine, getCart } from "@/lib/cart.js";
import S1LensCustomizationModal from "@/components/product/S1LensCustomizationModal.jsx";
import { isProductLiked, toggleProductLike } from "@/lib/productLikes.js";

const REDIRECT_MS = 1100;

/**
 * @param {{ likeKey: string, sku: string, productLabel: string, className?: string }} props
 */
export default function ProductQuickActions({ likeKey, sku, productLabel, className = "" }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(() => isProductLiked(likeKey));
  /** 'idle' | 'proceed' — after add, show Proceed and auto-go to profile */
  const [cartStep, setCartStep] = useState("idle");
  const redirectRef = useRef(null);

  const isS1 = sku === "s1";
  const [s1ModalOpen, setS1ModalOpen] = useState(false);

  const handleLike = () => {
    setLiked(toggleProductLike(likeKey));
  };

  const openS1Form = () => {
    setS1ModalOpen(true);
  };

  const closeS1Form = () => {
    setS1ModalOpen(false);
  };

  const handleS1WizardComplete = (prefs) => {
    addOrUpdateLine("s1", { s1Preferences: prefs });
    closeS1Form();
    navigate("/checkout", { state: { lineItems: getCart() } });
  };

  const handleAddToCart = () => {
    if (isS1) {
      openS1Form();
      return;
    }
    addOrUpdateLine(sku);
    setCartStep("proceed");
  };

  const goProfile = () => {
    if (redirectRef.current) {
      clearTimeout(redirectRef.current);
      redirectRef.current = null;
    }
    navigate("/dashboard");
  };

  useEffect(() => {
    if (cartStep !== "proceed") return;
    redirectRef.current = window.setTimeout(() => {
      redirectRef.current = null;
      navigate("/dashboard");
    }, REDIRECT_MS);
    return () => {
      if (redirectRef.current) clearTimeout(redirectRef.current);
    };
  }, [cartStep, navigate]);

  useEffect(() => {
    if (!s1ModalOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeS1Form();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [s1ModalOpen]);

  return (
    <motion.div
      className={`space-y-4 w-full max-w-lg mx-auto ${className || "mt-6"}`.trim()}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <S1LensCustomizationModal open={s1ModalOpen} onClose={closeS1Form} onComplete={handleS1WizardComplete} />

      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={handleLike}
          aria-pressed={liked}
          aria-label={liked ? "Remove from saved products" : "Save product to favorites"}
          className="inline-flex items-center justify-center rounded-full p-2.5 text-white/40 transition-colors hover:text-white/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        >
          <Heart
            className={`h-6 w-6 shrink-0 transition-colors ${
              liked ? "fill-rose-400/55 stroke-rose-200/50 text-rose-200/90" : "fill-transparent stroke-current"
            }`}
            strokeWidth={1.75}
          />
        </button>

        <AnimatePresence mode="wait" initial={false}>
          {cartStep === "idle" ? (
            <motion.div
              key="add"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                type="button"
                variant="default"
                onClick={handleAddToCart}
                className="rounded-full gap-2 px-6 min-w-[10.5rem] justify-center"
              >
                <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
                Add to cart
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="proceed"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:items-center sm:justify-center"
            >
              <Button
                type="button"
                variant="default"
                onClick={goProfile}
                className="rounded-full gap-2 px-7 min-w-[10.5rem] justify-center bg-emerald-500 text-black hover:bg-emerald-400"
              >
                Proceed
                <ArrowRight className="h-4 w-4" />
              </Button>
              <span className="inline-flex items-center justify-center gap-1.5 text-xs text-zinc-500 text-center">
                <Loader2 className="h-3.5 w-3.5 animate-spin opacity-80" />
                Opening My profile…
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="text-center text-xs sm:text-sm text-zinc-500 max-w-md mx-auto text-balance sm:max-w-lg">
        {isS1 && cartStep === "idle" ? (
          <>
            Tap <span className="text-zinc-400">Add to cart</span> to customize lenses (including OD/OS optical power from
            dropdowns when needed), then continue to <span className="text-zinc-400">checkout</span> (sign in if needed).
          </>
        ) : cartStep === "idle" ? (
          <>
            Add <span className="text-zinc-400">{productLabel}</span> to your bag, then continue to My profile to
            review and pay.
          </>
        ) : (
          <>
            Cart updated. We&apos;re taking you to <span className="text-zinc-400">My profile</span> to complete
            checkout—tap <span className="text-zinc-400">Proceed</span> to go there now.
          </>
        )}
      </p>
    </motion.div>
  );
}
