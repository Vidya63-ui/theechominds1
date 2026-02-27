import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { apiFetch, setToken } from "@/lib/api";

export default function LoginPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function checkBackend() {
      try {
        const base = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const response = await fetch(`${base}/health`);
        const data = await response.json();
        if (!mounted) {
          return;
        }
        if (response.ok && data.ok && data.db) {
          setBackendStatus("ready");
        } else if (response.ok && data.ok && !data.db) {
          setBackendStatus("db_down");
        } else {
          setBackendStatus("down");
        }
      } catch (_err) {
        if (mounted) {
          setBackendStatus("down");
        }
      }
    }
    checkBackend();
    return () => {
      mounted = false;
    };
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const body =
        mode === "login"
          ? { email: form.email, password: form.password }
          : { name: form.name, email: form.email, password: form.password };

      const result = await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      });

      setToken(result.token);
      navigate("/preorder");
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl border border-white/20 bg-black/50 backdrop-blur-md p-8 space-y-4"
        >
          <h1 className="text-2xl font-semibold">{mode === "login" ? "Login" : "Create account"}</h1>
          {mode === "register" && (
            <input
              required
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 outline-none focus:border-white/60"
            />
          )}
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 outline-none focus:border-white/60"
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 outline-none focus:border-white/60"
          />
          {error && <p className="text-red-300 text-sm">{error}</p>}
          {backendStatus === "down" && (
            <p className="text-amber-300 text-sm">Backend offline. Run `npm run dev:server`.</p>
          )}
          {backendStatus === "db_down" && (
            <p className="text-amber-300 text-sm">Backend is up, but MongoDB is not connected yet.</p>
          )}
          <Button type="submit" className="w-full rounded-full" disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Login to continue" : "Create account"}
          </Button>
          <button
            type="button"
            className="text-sm text-gray-300 hover:text-white"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "New user? Create account" : "Already have an account? Login"}
          </button>
        </motion.form>
      </div>
    </div>
  );
}
