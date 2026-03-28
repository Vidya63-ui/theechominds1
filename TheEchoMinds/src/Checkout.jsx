import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext.jsx";

const DEFAULT_PRODUCT = {
  name: "EchoLens G.1",
  model: "Lens G1",
  amount: 11999,
};

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = resolve;
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [product, setProduct] = useState(DEFAULT_PRODUCT);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const stateProduct = location.state?.product;
    if (stateProduct?.name || stateProduct?.amount) {
      setProduct((p) => ({
        name: stateProduct.name ?? p.name,
        model: stateProduct.model ?? p.model,
        amount: stateProduct.amount ?? p.amount,
      }));
    }
  }, [location.state]);

  useEffect(() => {
    apiFetch("/auth/me")
      .then(() => setAuthChecked(true))
      .catch(() =>
        navigate("/login", {
          replace: true,
          state: {
            redirectTo: "/checkout",
            product: location.state?.product,
          },
        })
      );
  }, [navigate, location.state]);

  const handlePayment = useCallback(async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const { razorpayOrderId } = await apiFetch("/orders/create-razorpay-order", {
        method: "POST",
        body: JSON.stringify({
          amount: product.amount,
          product: { name: product.name, model: product.model },
        }),
      });

      await loadRazorpayScript();

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        throw new Error("Razorpay key not configured. Add VITE_RAZORPAY_KEY_ID to .env");
      }

      const options = {
        key: razorpayKey,
        order_id: razorpayOrderId,
        name: "TheEchoMinds",
        description: product.name,
        handler: async (response) => {
          try {
            await apiFetch("/orders/verify", {
              method: "POST",
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                product: { name: product.name, model: product.model },
                amount: product.amount,
              }),
            });
            setSuccess("Order confirmed! Check your email for details.");
            setTimeout(() => navigate("/"), 2500);
          } catch (err) {
            setError(err.message || "Payment verification failed.");
          }
        },
        prefill: {},
        theme: { color: "#0a0a0a" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp) => {
        setError(resp.error?.description || "Payment failed. Please try again.");
      });
      rzp.open();
    } catch (err) {
      setError(err.message || "Failed to start checkout.");
    } finally {
      setLoading(false);
    }
  }, [product, navigate]);

  if (!authChecked) {
    return (
      <div className="relative min-h-screen text-white flex items-center justify-center">
        <div className="fixed inset-0 z-0 bg-black/80" />
        <p className="relative z-10">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white">
      <div className="fixed inset-0 z-0 overflow-hidden">
        <video autoPlay loop muted playsInline className="h-full w-full object-cover">
          <source src="/videos/4753-179739298_medium.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/80 via-black/70 to-teal-950/80" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl border border-emerald-400/30 bg-black/55 backdrop-blur-lg p-8 space-y-6"
        >
          <h1 className="text-3xl font-semibold">Checkout</h1>
          <p className="text-emerald-100 text-sm">Complete your purchase with Razorpay</p>

          <div className="rounded-2xl border border-white/15 bg-white/5 p-6 space-y-3">
            <h2 className="text-lg font-medium">{product.name}</h2>
            <p className="text-gray-300 text-sm">{product.model}</p>
            <p className="text-xl font-semibold">
              ₹{product.amount.toLocaleString("en-IN")}
            </p>
          </div>

          {error && <p className="text-red-300 text-sm">{error}</p>}
          {success && <p className="text-emerald-300 text-sm">{success}</p>}

          <div className="flex flex-col gap-3">
            <Button
              className="w-full rounded-full py-6 bg-emerald-600 hover:bg-emerald-500"
              disabled={loading}
              onClick={handlePayment}
            >
              {loading ? "Opening payment..." : "Pay with Razorpay"}
            </Button>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-full"
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
              <Button
                variant="outline"
                className="flex-1 rounded-full"
                onClick={() => logout(navigate)}
              >
                Logout
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
