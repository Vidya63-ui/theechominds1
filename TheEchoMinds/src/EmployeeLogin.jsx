import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SiteSubpageHeader from "@/components/SiteSubpageHeader.jsx";
import { useEmployeeAuth } from "@/context/EmployeeAuthContext.jsx";
import { API_BASE } from "@/lib/api";

/** Must be exactly @theechominds.com (case-insensitive), valid local part. */
const EMPLOYEE_EMAIL_RE = /^[a-z0-9](?:[a-z0-9._%+-]*[a-z0-9])?@theechominds\.com$/i;

function isValidEmployeeEmail(value) {
  return EMPLOYEE_EMAIL_RE.test(String(value || "").trim().toLowerCase());
}

async function postJson(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

export default function EmployeeLogin() {
  const navigate = useNavigate();
  const { commitEmployeeSession } = useEmployeeAuth();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const trimmed = email.trim();
  const emailValid = isValidEmployeeEmail(trimmed);

  const sendOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!emailValid) {
      setError("Only @theechominds.com addresses are allowed.");
      return;
    }
    setLoading(true);
    try {
      await postJson("/employee-auth/request-otp", { email: trimmed });
      setStep("otp");
    } catch (err) {
      setError(err.message || "Could not send code");
    } finally {
      setLoading(false);
    }
  };

  const verify = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(otp.trim())) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setLoading(true);
    try {
      const data = await postJson("/employee-auth/verify-otp", {
        email: trimmed.toLowerCase(),
        otp: otp.trim(),
      });
      if (data.token) {
        commitEmployeeSession(data.token, data.employee || { email: trimmed.toLowerCase() });
        navigate("/admin", { replace: true });
      } else {
        setError("Unexpected response from server.");
      }
    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-white">
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-zinc-950 via-black to-zinc-950" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteSubpageHeader
          leading={<h1 className="text-lg font-semibold tracking-tight text-white sm:text-xl">Employee login</h1>}
        />
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-10">
        <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-8 shadow-2xl backdrop-blur-md">
          <h1 className="text-2xl font-semibold tracking-tight">Employee login</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Use your <span className="text-cyan-300/90">@theechominds.com</span> email only. We will email you a
            one-time code. After sign-in you stay signed in for <span className="text-zinc-300">24 hours</span> on this
            device.
          </p>

          {step === "email" ? (
            <form className="mt-8 space-y-4" onSubmit={sendOtp}>
              <div>
                <label htmlFor="emp-email" className="block text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Work email
                </label>
                <input
                  id="emp-email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@theechominds.com"
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white placeholder:text-zinc-600 outline-none focus:border-cyan-500/50"
                />
                {trimmed && !emailValid && (
                  <p className="mt-2 text-sm text-amber-400">Only addresses ending in @theechominds.com are accepted.</p>
                )}
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <Button type="submit" className="w-full rounded-xl py-6" disabled={loading || !emailValid}>
                {loading ? "Sending…" : "Send verification code"}
              </Button>
            </form>
          ) : (
            <form className="mt-8 space-y-4" onSubmit={verify}>
              <p className="text-sm text-zinc-400">
                Code sent to <span className="text-white">{trimmed.toLowerCase()}</span>
              </p>
              <div>
                <label htmlFor="emp-otp" className="block text-xs font-medium uppercase tracking-wide text-zinc-400">
                  6-digit code
                </label>
                <input
                  id="emp-otp"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-center font-mono text-lg tracking-[0.3em] text-white outline-none focus:border-cyan-500/50"
                />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-xl border-white/20"
                  disabled={loading}
                  onClick={() => {
                    setStep("email");
                    setOtp("");
                    setError("");
                  }}
                >
                  Change email
                </Button>
                <Button type="submit" className="flex-1 rounded-xl py-6" disabled={loading}>
                  {loading ? "Verifying…" : "Verify & continue"}
                </Button>
              </div>
            </form>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
