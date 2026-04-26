import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import PageBackground from "@/components/PageBackground.jsx";
import SiteFooter from "@/components/SiteFooter.jsx";
import SiteSubpageHeader from "@/components/SiteSubpageHeader.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { apiFetch } from "@/lib/api";

const CATEGORIES = [
  { id: "complaint", label: "Complaint" },
  { id: "requirement", label: "Requirement" },
  { id: "service_repair", label: "Service / repair" },
  { id: "other", label: "Other" },
];

function greetingForUser(u) {
  const first = u?.name ? String(u.name).trim().split(/\s+/)[0] : "";
  return `Hi${first ? `, ${first}` : ""} — we will use your account email and phone on file. What kind of request is this?`;
}

export default function HelpCentrePage() {
  const { user, loading } = useAuth();
  const [messages, setMessages] = useState([]);
  const [step, setStep] = useState("category");
  const [category, setCategory] = useState("");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  const pushBot = useCallback((text) => {
    setMessages((m) => [...m, { role: "bot", text }]);
  }, []);

  const resetToCategory = useCallback(() => {
    if (!user) return;
    setCategory("");
    setInput("");
    setError("");
    setStep("category");
    setMessages([{ role: "bot", text: greetingForUser(user) }]);
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;
    resetToCategory();
    // Only re-run when the logged-in account changes (not on every profile field refresh).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, step]);

  const pickCategory = (id) => {
    const label = CATEGORIES.find((c) => c.id === id)?.label || id;
    setCategory(id);
    setMessages((m) => [...m, { role: "user", text: label }]);
    pushBot("Describe your complaint, requirement, repair need, or question (at least 10 characters).");
    setStep("message");
  };

  const submitMessage = async () => {
    const line = input.trim();
    setError("");
    if (line.length < 10) {
      pushBot("Please add a bit more detail — at least 10 characters.");
      return;
    }
    setInput("");
    setMessages((m) => [...m, { role: "user", text: line }]);
    setStep("submitting");
    pushBot("Sending your request…");
    try {
      const data = await apiFetch("/help-centre/tickets", {
        method: "POST",
        body: JSON.stringify({ category, message: line }),
      });
      setMessages((m) => [
        ...m.filter((x) => x.text !== "Sending your request…"),
        {
          role: "bot",
          text: `Thanks. ${data.message || "We have your request."} Reference: ${data.ticket?.ticketId || "—"}.`,
        },
      ]);
      setStep("done");
    } catch (e) {
      setMessages((m) => m.filter((x) => x.text !== "Sending your request…"));
      setError(e?.message || "Could not submit.");
      setStep("message");
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen text-white">
        <PageBackground />
        <div className="relative z-10 flex min-h-screen items-center justify-center text-zinc-400 text-sm">Loading…</div>
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
              <p className="text-xs font-medium uppercase tracking-wider text-cyan-400/90">Help</p>
              <h1 className="text-lg font-semibold tracking-tight text-white sm:text-xl">Help Centre</h1>
            </div>
          }
        />

        <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
          <p className="mb-2 text-sm text-zinc-300">
            Signed in as <span className="text-white">{user?.email}</span>
            {user?.phone ? (
              <>
                {" "}
                · <span className="text-white">{user.phone}</span>
              </>
            ) : null}
          </p>
          <p className="mb-6 text-sm text-zinc-500">
            Choose a category, then describe your request. Your name and contact details are taken from your account.
          </p>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/70 shadow-2xl backdrop-blur-md">
            <div className="max-h-[min(32rem,70vh)] space-y-3 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div
                    key={`${i}-${msg.text.slice(0, 24)}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[90%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[85%] ${
                        msg.role === "user"
                          ? "border border-cyan-500/25 bg-cyan-600/25 text-cyan-50"
                          : "border border-white/10 bg-white/[0.06] text-zinc-200"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {step === "category" && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {CATEGORIES.map((c) => (
                    <Button
                      key={c.id}
                      type="button"
                      variant="outline"
                      className="rounded-full border-white/20 text-xs sm:text-sm"
                      onClick={() => pickCategory(c.id)}
                    >
                      {c.label}
                    </Button>
                  ))}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {(step === "message" || step === "submitting") && (
              <div className="border-t border-white/10 bg-black/30 p-3 sm:p-4">
                {error && <p className="mb-2 text-xs text-red-400">{error}</p>}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (step === "message") void submitMessage();
                      }
                    }}
                    disabled={step === "submitting"}
                    placeholder="Describe your request…"
                    className="min-w-0 flex-1 rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-cyan-500/40 disabled:opacity-50"
                  />
                  <Button type="button" className="shrink-0 rounded-xl px-5" disabled={step === "submitting"} onClick={() => void submitMessage()}>
                    Send
                  </Button>
                </div>
              </div>
            )}

            {step === "done" && (
              <div className="border-t border-white/10 bg-black/30 p-4 text-center">
                <Button type="button" variant="outline" className="rounded-full border-white/20" onClick={resetToCategory}>
                  Start a new request
                </Button>
              </div>
            )}
          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
