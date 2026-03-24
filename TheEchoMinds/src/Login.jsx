import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext.jsx";

export default function LoginPage() {
  const [mode, setMode] = useState("login");
  const [step, setStep] = useState("form");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    otp: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking");
  const [pendingEmail, setPendingEmail] = useState("");
  const [cameFromLogin, setCameFromLogin] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false);
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();

  async function handleResendOtp() {
    if (!pendingEmail) return;
    setError("");
    setResendingOtp(true);
    try {
      const result = await apiFetch("/auth/resend-otp", {
        method: "POST",
        body: JSON.stringify({ email: pendingEmail }),
      });
      setSuccessMessage(result.message || "Code resent! Check your email.");
    } catch (err) {
      setError(err.message);
    } finally {
      setResendingOtp(false);
    }
  }

  useEffect(() => {
    let mounted = true;
    async function checkBackend() {
      try {
        const base = import.meta.env.VITE_API_URL ?? "/api";
        const response = await fetch(`${base}/health`, { credentials: "include" });
        const data = await response.json();
        if (!mounted) return;
        if (response.ok && data.ok && data.db) setBackendStatus("ready");
        else if (response.ok && data.ok && !data.db) setBackendStatus("db_down");
        else setBackendStatus("down");
      } catch (_err) {
        if (mounted) setBackendStatus("down");
      }
    }
    checkBackend();
    return () => { mounted = false; };
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);
    try {
      if (mode === "verify-otp") {
        await apiFetch("/auth/verify-otp", {
          method: "POST",
          body: JSON.stringify({ email: pendingEmail, otp: form.otp }),
        });
        refreshAuth();
        navigate("/preorder");
        return;
      }
      if (mode === "login") {
        const result = await apiFetch("/auth/login", {
          method: "POST",
          body: JSON.stringify({
            email: form.email || undefined,
            phone: form.phone || undefined,
            password: form.password,
          }),
        });
        if (result.needsVerification) {
          setPendingEmail(result.email);
          setStep("otp");
          setMode("verify-otp");
          setCameFromLogin(true);
          setForm((f) => ({ ...f, otp: "" }));
          setSuccessMessage(result.message || "Verification code sent! Check your email.");
          return;
        }
        refreshAuth();
        navigate("/preorder");
        return;
      }
      if (mode === "register") {
        await apiFetch("/auth/register", {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
            password: form.password,
          }),
        });
        setPendingEmail(form.email);
        setStep("otp");
        setMode("verify-otp");
        setCameFromLogin(false);
        setForm((f) => ({ ...f, otp: "" }));
        setSuccessMessage("Verification code sent! Check your email and enter it below.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const isOtpStep = step === "otp" || mode === "verify-otp";

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
          <h1 className="text-2xl font-semibold">
            {isOtpStep ? "Verify email" : mode === "login" ? "Login" : "Create account"}
          </h1>

          {isOtpStep ? (
            <>
              {successMessage && (
                <p className="text-sm text-emerald-300">{successMessage}</p>
              )}
              <p className="text-sm text-gray-300">Enter the 6-digit verification code sent to</p>
              <p className="text-sm font-medium text-white">{pendingEmail}</p>
              <input
                required
                placeholder="6-digit OTP"
                maxLength={6}
                inputMode="numeric"
                autoComplete="one-time-code"
                value={form.otp}
                onChange={(e) => setForm({ ...form, otp: e.target.value.replace(/\D/g, "") })}
                className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-center text-lg tracking-[0.5em] outline-none focus:border-white/60"
              />
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  className="text-sm text-cyan-300 hover:text-cyan-200 disabled:opacity-50"
                  onClick={handleResendOtp}
                  disabled={resendingOtp}
                >
                  {resendingOtp ? "Sending..." : "Didn't receive the code? Resend"}
                </button>
                <button
                  type="button"
                  className="text-sm text-gray-300 hover:text-white"
                  onClick={() => {
                    setMode(cameFromLogin ? "login" : "register");
                    setStep("form");
                    setSuccessMessage("");
                  }}
                >
                  {cameFromLogin ? "Back to login" : "Change email"}
                </button>
              </div>
            </>
          ) : (
            <>
              {mode === "register" && (
                <input
                  required
                  placeholder="Full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 outline-none focus:border-white/60"
                />
              )}
              {mode === "login" && (
                <input
                  placeholder="Email or phone"
                  value={form.email || form.phone}
                  onChange={(e) => {
                    const v = e.target.value;
                    const isPhone = /^\d[\d\s-]*$/.test(v);
                    setForm({
                      ...form,
                      email: isPhone ? "" : v,
                      phone: isPhone ? v : "",
                    });
                  }}
                  className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 outline-none focus:border-white/60"
                />
              )}
              {mode === "register" && (
                <>
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
                    placeholder="Phone number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 outline-none focus:border-white/60"
                  />
                </>
              )}
              <input
                required
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 outline-none focus:border-white/60"
              />
            </>
          )}

          {error && <p className="text-red-300 text-sm">{error}</p>}
          {backendStatus === "down" && (
            <p className="text-amber-300 text-sm">Backend offline. Run `npm run dev:server`.</p>
          )}
          {backendStatus === "db_down" && (
            <p className="text-amber-300 text-sm">Backend is up, but MongoDB is not connected yet.</p>
          )}

          <Button type="submit" className="w-full rounded-full" disabled={loading}>
            {loading ? "Please wait..." : isOtpStep ? "Verify" : mode === "login" ? "Login" : "Create account"}
          </Button>

          {!isOtpStep && (
            <button
              type="button"
              className="text-sm text-gray-300 hover:text-white"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
            >
              {mode === "login" ? "New user? Create account" : "Already have an account? Login"}
            </button>
          )}
        </motion.form>
      </div>
    </div>
  );
}
