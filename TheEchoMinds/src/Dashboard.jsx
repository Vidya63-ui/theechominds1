import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageBackground from "@/components/PageBackground.jsx";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import {
  CART_CATALOG,
  getCart,
  cartSubtotal,
  addOrUpdateLine,
  setLineQty,
  removeLine,
} from "@/lib/cart";
import { s1PreferencesReviewRows } from "@/lib/s1Preferences.js";
import { Package, ShoppingBag, Truck, CheckCircle2, Circle } from "lucide-react";
import SiteSubpageHeader from "@/components/SiteSubpageHeader.jsx";

const ACTIVE_FULFILLMENT = new Set(["confirmed", "processing", "shipped", "delivered"]);

function OrderTracker({ order, onRefresh }) {
  const paid = ACTIVE_FULFILLMENT.has(order.status);
  const delivered = order.status === "delivered";
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState("");

  const steps = [
    { key: "placed", label: "Order placed", done: true, hint: "We received your order details." },
    { key: "paid", label: "Payment confirmed", done: paid, hint: "Razorpay payment completed successfully." },
    {
      key: "delivered",
      label: "Delivered",
      done: delivered,
      hint: "When your package arrives, mark as delivered here to post a product review.",
    },
  ];

  const confirmReceived = async () => {
    setErr("");
    setPending(true);
    try {
      await apiFetch(`/orders/${encodeURIComponent(order.orderId)}/confirm-delivery`, {
        method: "POST",
        body: JSON.stringify({}),
      });
      onRefresh?.();
    } catch (e) {
      setErr(e?.message || "Could not update order. Try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Order</p>
          <p className="font-mono text-sm text-white break-all">{order.orderId}</p>
        </div>
        <span
          className={`text-xs px-2.5 py-1 rounded-full ${
            delivered
              ? "bg-sky-500/15 text-sky-200"
              : paid
                ? "bg-emerald-500/15 text-emerald-300"
                : "bg-amber-500/15 text-amber-200"
          }`}
        >
          {order.status}
        </span>
      </div>
      <ol className="space-y-3">
        {steps.map((s) => (
          <li key={s.key} className="flex gap-3">
            {s.done ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <Circle className="h-5 w-5 text-zinc-600 shrink-0 mt-0.5" />
            )}
            <div>
              <p className={`text-sm font-medium ${s.done ? "text-white" : "text-zinc-500"}`}>{s.label}</p>
              {s.hint && <p className="text-xs text-zinc-500 mt-0.5 max-w-md">{s.hint}</p>}
            </div>
          </li>
        ))}
      </ol>
      {["confirmed", "processing", "shipped"].includes(order.status) && (
        <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
          <p className="text-xs text-zinc-500">Received your order? Confirm delivery to post a review on the product page.</p>
          {err && <p className="text-xs text-rose-400">{err}</p>}
          <Button
            type="button"
            variant="outline"
            className="rounded-full text-sm"
            disabled={pending}
            onClick={confirmReceived}
          >
            {pending ? "Saving…" : "Mark as delivered"}
          </Button>
        </div>
      )}
      <p className="text-xs text-zinc-500 mt-4 pt-3 border-t border-white/10">
        Amount paid: <span className="text-zinc-300">₹{order.amount?.toLocaleString("en-IN")}</span>
        {" · "}
        {order.createdAt && new Date(order.createdAt).toLocaleString()}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [preorders, setPreorders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cart, setCart] = useState(getCart);

  const refreshCart = useCallback(() => {
    setCart(getCart());
  }, []);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [me, ord, pre] = await Promise.all([
        apiFetch("/auth/me"),
        apiFetch("/orders/me"),
        apiFetch("/preorders/me"),
      ]);
      setUser(me.user);
      setOrders(ord.orders || []);
      setPreorders(pre.preorders || []);
    } catch (err) {
      console.error("Profile load error:", err);
      setError("Failed to load your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const subtotal = cartSubtotal(cart);
  const recentForTracking = orders.slice(0, 2);

  const goCheckout = () => {
    if (cart.length === 0) return;
    navigate("/checkout", {
      state: { lineItems: cart },
    });
  };

  if (loading) {
    return (
      <div className="relative min-h-screen text-white">
        <PageBackground />
        <div className="relative z-10 h-screen flex items-center justify-center">
          <p className="text-zinc-400">Loading your profile…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen text-white">
        <PageBackground />
        <div className="relative z-10 h-screen flex flex-col items-center justify-center gap-4 px-6">
          <p className="text-red-300">{error}</p>
          <Button variant="outline" className="rounded-full" onClick={() => navigate("/login")}>
            Go to login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white">
      <PageBackground />
      <div className="relative z-10">
        <SiteSubpageHeader
          innerClassName="max-w-4xl"
          leading={
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">My Profile</h1>
              <p className="text-zinc-400 mt-0.5 text-xs sm:text-sm">
                Welcome back{user?.name ? `, ${user.name}` : ""}
              </p>
            </div>
          }
        />
        <div className="mx-auto max-w-4xl px-4 pb-20 pt-6 sm:px-6 sm:pt-8 sm:pb-24">
        {/* —— Cart (above everything else) —— */}
        <motion.section
          className="mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="h-5 w-5 text-cyan-300/80" />
            <h2 className="text-lg font-semibold">Your cart</h2>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-950/50 backdrop-blur-md p-4 sm:p-6 space-y-4">
            <p className="text-sm text-zinc-500">Add products, adjust quantities, then check out with Razorpay.</p>
            <div className="flex flex-wrap gap-2">
              {CART_CATALOG.map((p) => (
                <Button
                  key={p.sku}
                  type="button"
                  variant="outline"
                  className="rounded-full text-sm"
                  onClick={() => {
                    addOrUpdateLine(p.sku);
                    refreshCart();
                  }}
                >
                  Add {p.name}
                </Button>
              ))}
            </div>
            {cart.length === 0 ? (
              <p className="text-zinc-500 text-sm py-4 text-center border border-dashed border-white/10 rounded-xl">
                Your cart is empty. Use the buttons above to add EchoLens models.
              </p>
            ) : (
              <ul className="space-y-3">
                {cart.map((line) => (
                  <li
                    key={line.sku}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-white">{line.name}</p>
                      <p className="text-xs text-zinc-500">{line.model}</p>
                      {line.lensLabel && (
                        <p className="text-xs text-violet-300/90 mt-1">Lens: {line.lensLabel}</p>
                      )}
                      {line.sku === "s1" && line.s1Preferences && (
                        <ul className="mt-2 space-y-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2">
                          {s1PreferencesReviewRows(line.s1Preferences).map((row) => (
                            <li key={row.label} className="text-[11px] text-zinc-400 leading-snug">
                              <span className="font-medium text-zinc-500">{row.label}:</span> {row.value}
                            </li>
                          ))}
                        </ul>
                      )}
                      {line.opticalPowerNotes && (
                        <p className="text-xs text-zinc-400 mt-1 break-words line-clamp-3" title={line.opticalPowerNotes}>
                          RX: {line.opticalPowerNotes}
                        </p>
                      )}
                      <p className="text-sm text-zinc-300 mt-1">
                        ₹{line.amount?.toLocaleString("en-IN")} each
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="sr-only" htmlFor={`qty-${line.sku}`}>
                        Quantity
                      </label>
                      <input
                        id={`qty-${line.sku}`}
                        type="number"
                        min={0}
                        max={99}
                        value={line.qty}
                        onChange={(e) => {
                          setLineQty(line.sku, e.target.value);
                          refreshCart();
                        }}
                        className="w-16 rounded-lg border border-white/20 bg-black/40 px-2 py-1.5 text-sm text-center text-white"
                      />
                      <span className="text-sm text-zinc-300 w-24 text-right">
                        ₹{(line.amount * line.qty).toLocaleString("en-IN")}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-zinc-500 hover:text-rose-300"
                        onClick={() => {
                          removeLine(line.sku);
                          refreshCart();
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {cart.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-white/10">
                <p className="text-lg font-semibold">
                  Subtotal:{" "}
                  <span className="text-cyan-200/90">₹{subtotal.toLocaleString("en-IN")}</span>
                </p>
                <Button
                  className="rounded-full px-8 w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500"
                  onClick={goCheckout}
                >
                  Proceed to checkout
                </Button>
              </div>
            )}
          </div>
        </motion.section>

        {/* —— Profile —— */}
        {user && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-4">Account details</h2>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {[
                { label: "Name", value: user.name },
                { label: "Email", value: user.email, mono: true },
                { label: "Phone", value: user.phone },
                {
                  label: "Verification",
                  value: user.isVerified ? "Verified" : "Pending",
                  good: user.isVerified,
                },
              ].map((f) => (
                <div
                  key={f.label}
                  className="rounded-xl border border-white/10 bg-white/[0.04] p-4"
                >
                  <p className="text-xs text-zinc-500 uppercase tracking-wide">{f.label}</p>
                  <p
                    className={`mt-1 text-sm font-medium ${
                      f.mono ? "break-all font-mono" : ""
                    } ${f.good === true ? "text-emerald-300" : f.good === false ? "text-amber-200" : "text-white"}`}
                  >
                    {f.value}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* —— Order tracking —— */}
        {orders.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="h-5 w-5 text-amber-200/80" />
              <h2 className="text-lg font-semibold">Order tracking</h2>
            </div>
            <p className="text-sm text-zinc-500 mb-4">
              Latest payment status and next steps. Shipping updates are shared by email.
            </p>
            <div className="space-y-4">
              {recentForTracking.map((order) => (
                <OrderTracker key={order._id} order={order} onRefresh={loadProfile} />
              ))}
            </div>
          </section>
        )}

        {/* —— Past order history —— */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-violet-300/80" />
            <h2 className="text-lg font-semibold">Past order history</h2>
          </div>
          {orders.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center text-zinc-500 text-sm">
              No paid orders yet. Complete a purchase from checkout to see it here.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-sm text-left min-w-[520px]">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-500 text-xs uppercase tracking-wider">
                    <th className="p-3 pl-4">Order ID</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Payment ref.</th>
                    <th className="p-3 pr-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.04]">
                      <td className="p-3 pl-4 font-mono text-xs sm:text-sm whitespace-nowrap max-w-[8rem] truncate" title={o.orderId}>
                        {o.orderId}
                      </td>
                      <td className="p-3">
                        <span
                          className={
                            o.status === "delivered"
                              ? "text-sky-300/90"
                              : ["confirmed", "processing", "shipped"].includes(o.status)
                                ? "text-emerald-300/90"
                                : "text-amber-200"
                          }
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="p-3">₹{o.amount?.toLocaleString("en-IN")}</td>
                      <td className="p-3 font-mono text-xs text-zinc-400 max-w-[120px] truncate" title={o.razorpayPaymentId}>
                        {o.razorpayPaymentId || "—"}
                      </td>
                      <td className="p-3 pr-4 text-zinc-400 text-xs">
                        {o.createdAt && new Date(o.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* —— Pre-order history —— */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Pre-order history</h2>
          {preorders.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center text-zinc-500 text-sm">
              No pre-orders on file.{" "}
              <Link to="/preorder" className="text-cyan-400 hover:underline">
                Place a pre-order
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {preorders.map((p) => (
                <div
                  key={p._id}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                >
                  <p className="text-xs text-zinc-500">Preorder</p>
                  <p className="font-mono text-sm break-all text-white mt-0.5">{p.preorderId}</p>
                  <span
                    className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-md ${
                      p.status === "confirmed" ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-200"
                    }`}
                  >
                    {p.status}
                  </span>
                  {p.product && (
                    <div className="mt-3 text-sm text-zinc-300 space-y-1">
                      {p.product.model && <p>Model: {p.product.model}</p>}
                      {p.product.city && <p>City: {p.product.city}</p>}
                    </div>
                  )}
                  <p className="text-xs text-zinc-500 mt-3">
                    {p.createdAt && new Date(p.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
        </div>
      </div>
    </div>
  );
}
