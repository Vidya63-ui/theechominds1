import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

export default function PaymentPage() {
  const { preorderId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    amount: "",
    paymentMethod: "UPI",
    transactionId: "",
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiFetch("/auth/me").catch(() => navigate("/login"));
  }, [navigate]);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!file) {
      setError("Please upload a payment screenshot.");
      return;
    }

    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("amount", form.amount);
      payload.append("paymentMethod", form.paymentMethod);
      payload.append("transactionId", form.transactionId);
      payload.append("screenshot", file);

      await apiFetch(`/payments/${preorderId}/upload`, {
        method: "POST",
        body: payload,
      });

      setSuccess("Payment details submitted. Our team will verify and contact you.");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen text-white">
      <div className="fixed inset-0 z-0 overflow-hidden">
        <video autoPlay loop muted playsInline className="h-full w-full object-cover saturate-150">
          <source src="/videos/4753-179739298_medium.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/80 via-black/70 to-indigo-950/70" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl rounded-3xl border border-cyan-300/30 bg-black/55 backdrop-blur-lg p-8 space-y-4"
        >
          <h1 className="text-3xl font-semibold">Payment Confirmation</h1>
          <p className="text-cyan-100 text-sm">Step 2 of 2: add payment details and upload screenshot proof.</p>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              required
              type="number"
              min="0"
              placeholder="Amount paid"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="rounded-xl bg-white/10 border border-white/20 px-4 py-3 outline-none focus:border-cyan-300"
            />
            <select
              value={form.paymentMethod}
              onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
              className="rounded-xl bg-white/10 border border-white/20 px-4 py-3 outline-none focus:border-cyan-300"
            >
              <option className="text-black">UPI</option>
              <option className="text-black">Bank Transfer</option>
              <option className="text-black">Card</option>
            </select>
          </div>

          <input
            required
            placeholder="Transaction / UTR ID"
            value={form.transactionId}
            onChange={(e) => setForm({ ...form, transactionId: e.target.value })}
            className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 outline-none focus:border-cyan-300"
          />

          <div className="rounded-2xl border border-dashed border-white/30 p-4">
            <label className="block text-sm text-gray-200 mb-2">Upload payment screenshot</label>
            <input
              required
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm"
            />
          </div>

          {error && <p className="text-red-300 text-sm">{error}</p>}
          {success && <p className="text-emerald-300 text-sm">{success}</p>}

          <Button type="submit" className="rounded-full px-8" disabled={loading}>
            {loading ? "Uploading..." : "Submit Payment Proof"}
          </Button>
        </motion.form>
      </div>
    </div>
  );
}
