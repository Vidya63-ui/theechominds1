import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext.jsx";
import SiteSubpageHeader from "@/components/SiteSubpageHeader.jsx";

export default function PreorderPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
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
    window.scrollTo(0, 0);
  }, []);

  // useEffect(() => {
  //   refreshAuth().catch(() => navigate("/login"));
  // }, [navigate, refreshAuth]);

  useEffect(() => {
  if (!isLoggedIn) {
    navigate("/login", { replace: true });
  }
}, [isLoggedIn, navigate]);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await apiFetch("/preorders", {
        method: "POST",
        body: JSON.stringify(form),
      });
      navigate(`/?preorder=success&id=${result.preorder.preorderId}`);
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

      <div className="relative z-10">
        <SiteSubpageHeader
          leading={<h1 className="text-lg md:text-xl font-semibold tracking-wide text-white">Pre-order</h1>}
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-start justify-center px-4 pt-6 pb-16 md:pt-10">
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl rounded-3xl border border-white/20 bg-black/50 backdrop-blur-md p-8 space-y-4"
        >
          <h1 className="text-3xl font-semibold">Pre-order EchoLens S.1</h1>
          <p className="text-gray-300 text-sm">Enter your details for the EchoLens S.1 preorder.</p>

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

          <input
            type="text"
            value="EchoLens S.1"
            readOnly
            className="w-full rounded-xl bg-white/5 border border-white/20 px-4 py-3 outline-none cursor-default text-gray-300"
          />

          {error && <p className="text-red-300 text-sm">{error}</p>}
          <Button type="submit" className="rounded-full px-8" disabled={loading}>
            {loading ? "Saving..." : "Place Preorder"}
          </Button>
        </motion.form>
      </div>
    </div>
  );
}
