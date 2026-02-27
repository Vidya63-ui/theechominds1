import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { apiFetch, getToken } from "@/lib/api";

export default function PreorderPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    model: "Lens S1",
    city: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      navigate("/login");
    }
  }, [navigate]);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await apiFetch("/preorders", {
        method: "POST",
        body: JSON.stringify(form),
      });
      navigate(`/payment/${result.preorder._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen text-white">
      <div className="fixed inset-0 z-0 overflow-hidden">
        <video autoPlay loop muted playsInline className="h-full w-full object-cover">
          <source src="/videos/4753-179739298_medium.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-zinc-900/70 to-black/60" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl rounded-3xl border border-white/20 bg-black/50 backdrop-blur-md p-8 space-y-4"
        >
          <h1 className="text-3xl font-semibold">Pre-order Details</h1>
          <p className="text-gray-300 text-sm">Step 1 of 2: enter your customer details.</p>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              required
              placeholder="Full name"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="rounded-xl bg-white/10 border border-white/20 px-4 py-3 outline-none focus:border-white/60"
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rounded-xl bg-white/10 border border-white/20 px-4 py-3 outline-none focus:border-white/60"
            />
            <input
              required
              placeholder="Phone number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="rounded-xl bg-white/10 border border-white/20 px-4 py-3 outline-none focus:border-white/60"
            />
            <input
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="rounded-xl bg-white/10 border border-white/20 px-4 py-3 outline-none focus:border-white/60"
            />
          </div>

          <select
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
            className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 outline-none focus:border-white/60"
          >
            <option className="text-black">Lens S1</option>
            <option className="text-black">Lens G1</option>
          </select>

          {error && <p className="text-red-300 text-sm">{error}</p>}
          <Button type="submit" className="rounded-full px-8" disabled={loading}>
            {loading ? "Saving..." : "Continue to Payment"}
          </Button>
        </motion.form>
      </div>
    </div>
  );
}
