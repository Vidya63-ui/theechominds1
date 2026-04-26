import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import SiteSubpageHeader from "@/components/SiteSubpageHeader.jsx";
import { employeeApiFetch } from "@/lib/api";

const CATEGORY_LABEL = {
  complaint: "Complaint",
  requirement: "Requirement",
  service_repair: "Service / repair",
  other: "Other",
};

export default function EchoSpace() {
  const [tickets, setTickets] = useState([]);
  const [ticketErr, setTicketErr] = useState("");
  const [ticketLoading, setTicketLoading] = useState(true);

  const loadTickets = useCallback(async () => {
    setTicketErr("");
    setTicketLoading(true);
    try {
      const data = await employeeApiFetch("/admin/help-centre-tickets");
      setTickets(data.tickets || []);
    } catch (e) {
      setTicketErr(e?.message || "Could not load help centre tickets.");
      setTickets([]);
    } finally {
      setTicketLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTickets();
  }, [loadTickets]);

  return (
    <div className="relative min-h-screen text-white">
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-zinc-950 via-slate-950 to-black" />
      <div className="relative z-10">
        <SiteSubpageHeader
          innerClassName="max-w-4xl"
          leading={
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/90">Internal</p>
              <h1 className="text-lg font-semibold text-white sm:text-xl">EchoSpace</h1>
            </div>
          }
        />
        <div className="mx-auto max-w-4xl px-6 py-8 sm:py-12">
        <header className="mb-12 rounded-3xl border border-cyan-500/20 bg-black/40 p-10 text-center backdrop-blur-md sm:p-14">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400/90">The EchoMinds</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">EchoSpace</h1>
          <p className="mx-auto mt-6 max-w-lg text-base text-zinc-400 sm:text-lg">
            Internal space for team members. Help Centre submissions from customers appear below.
          </p>
        </header>

        <section className="rounded-3xl border border-white/10 bg-black/35 p-6 backdrop-blur-md sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold tracking-tight text-white">Help Centre Management</h2>
            <Button type="button" variant="outline" className="rounded-full border-white/20 text-sm" onClick={() => void loadTickets()} disabled={ticketLoading}>
              {ticketLoading ? "Refreshing…" : "Refresh"}
            </Button>
          </div>
          <p className="mb-4 text-sm text-zinc-500">
            Complaints, requirements, service/repair requests, and other queries from the public Help Centre chatbot.
          </p>

          {ticketErr && <p className="mb-4 rounded-xl border border-red-500/30 bg-red-950/30 px-3 py-2 text-sm text-red-200">{ticketErr}</p>}

          {ticketLoading && !ticketErr ? (
            <p className="text-sm text-zinc-500">Loading…</p>
          ) : tickets.length === 0 ? (
            <p className="text-sm text-zinc-500">No submissions yet.</p>
          ) : (
            <div className="space-y-4">
              {tickets.map((t) => {
                const linked = t.userId && typeof t.userId === "object";
                return (
                  <article
                    key={t._id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 border-b border-white/10 pb-3">
                      <div>
                        <p className="font-mono text-xs text-cyan-300/90">{t.ticketId}</p>
                        <p className="mt-1 text-sm text-zinc-400">
                          {t.createdAt ? new Date(t.createdAt).toLocaleString() : "—"}
                        </p>
                      </div>
                      <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs text-amber-200">
                        {CATEGORY_LABEL[t.category] || t.category}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                      <p>
                        <span className="text-zinc-500">Name: </span>
                        <span className="text-zinc-100">{t.name}</span>
                      </p>
                      <p>
                        <span className="text-zinc-500">Email: </span>
                        <span className="break-all text-zinc-100">{t.email}</span>
                      </p>
                      {t.phone ? (
                        <p>
                          <span className="text-zinc-500">Phone: </span>
                          <span className="text-zinc-100">{t.phone}</span>
                        </p>
                      ) : null}
                      {linked ? (
                        <div className="sm:col-span-2 rounded-xl border border-cyan-500/15 bg-cyan-950/20 px-3 py-2 text-xs">
                          <p className="font-medium text-cyan-200/90">Linked account</p>
                          <p className="mt-1 text-zinc-300">
                            {t.userId.name} · {t.userId.email}
                            {t.userId.phone ? ` · ${t.userId.phone}` : ""}
                          </p>
                        </div>
                      ) : null}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-200 whitespace-pre-wrap">{t.message}</p>
                  </article>
                );
              })}
            </div>
          )}
        </section>
        </div>
      </div>
    </div>
  );
}
