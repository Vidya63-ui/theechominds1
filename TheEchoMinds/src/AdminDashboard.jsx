import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { employeeApiFetch } from "@/lib/api";
import { useEmployeeAuth } from "@/context/EmployeeAuthContext.jsx";
import SiteSubpageHeader from "@/components/SiteSubpageHeader.jsx";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "processing", label: "Processing" },
  { value: "confirmed", label: "Confirmed" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

const ROW_STATUS_OPTIONS = [
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

export default function AdminDashboard() {
  const { employee } = useEmployeeAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [counts, setCounts] = useState({ inProcess: 0, done: 0, total: 0 });
  const [statusFilter, setStatusFilter] = useState("all");
  const [products, setProducts] = useState([]);
  const [stockDraft, setStockDraft] = useState({});
  const [savingSlug, setSavingSlug] = useState(null);

  const load = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const q = statusFilter === "all" ? "" : `?status=${encodeURIComponent(statusFilter)}`;
      const data = await employeeApiFetch(`/admin/orders${q}`);
      setOrders(data.orders || []);
      setCounts(data.counts || { inProcess: 0, done: 0, total: 0 });

      const pdata = await employeeApiFetch("/admin/products");
      const list = pdata.products || [];
      setProducts(list);
      const draft = {};
      for (const p of list) {
        draft[p.slug] = String(p.stock ?? 0);
      }
      setStockDraft(draft);
    } catch (e) {
      setError(e?.message || "Could not load admin data.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const updateOrderStatus = async (orderId, status) => {
    setError("");
    try {
      await employeeApiFetch(`/admin/orders/${encodeURIComponent(orderId)}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await load();
    } catch (e) {
      setError(e?.message || "Update failed.");
    }
  };

  const saveStock = async (slug) => {
    const raw = stockDraft[slug];
    const n = Math.floor(Number(raw));
    if (!Number.isFinite(n) || n < 0) {
      setError("Stock must be a non-negative number.");
      return;
    }
    setSavingSlug(slug);
    setError("");
    try {
      await employeeApiFetch(`/admin/products/${encodeURIComponent(slug)}/stock`, {
        method: "PATCH",
        body: JSON.stringify({ stock: n }),
      });
      await load();
    } catch (e) {
      setError(e?.message || "Could not save stock.");
    } finally {
      setSavingSlug(null);
    }
  };

  return (
    <div className="relative min-h-screen text-white">
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-zinc-950 via-black to-zinc-950" />
      <div className="relative z-10">
        <SiteSubpageHeader
          leading={
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/90">Admin</p>
              <h1 className="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">Orders &amp; inventory</h1>
              {employee?.email && (
                <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                  Signed in as <span className="text-zinc-300">{employee.email}</span>
                </p>
              )}
            </div>
          }
        />
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-200">{error}</div>
        )}

        <section className="mb-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-wider text-zinc-500">In progress</p>
            <p className="mt-2 text-3xl font-semibold text-amber-200">{counts.inProcess}</p>
            <p className="mt-1 text-xs text-zinc-500">Paid, not yet delivered</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-wider text-zinc-500">Done</p>
            <p className="mt-2 text-3xl font-semibold text-emerald-300">{counts.done}</p>
            <p className="mt-1 text-xs text-zinc-500">Delivered</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-wider text-zinc-500">Total orders</p>
            <p className="mt-2 text-3xl font-semibold text-white">{counts.total}</p>
            <p className="mt-1 text-xs text-zinc-500">All records</p>
          </div>
        </section>

        <section className="mb-12 rounded-2xl border border-white/10 bg-zinc-950/50 p-5 sm:p-8">
          <h2 className="text-lg font-semibold text-white">Product stock</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Manual counts for storefront SKUs. &quot;Sold (est.)&quot; sums quantities from delivered orders (cart line
            items or single-item orders).
          </p>
          <div className="mt-6 space-y-4">
            {products.map((p) => (
              <div
                key={p.slug}
                className="flex flex-col gap-3 rounded-xl border border-white/10 bg-black/30 p-4 sm:flex-row sm:items-end sm:justify-between"
              >
                <div>
                  <p className="font-medium text-white">{p.name}</p>
                  <p className="text-xs text-zinc-500">
                    SKU <span className="font-mono text-zinc-400">{p.slug}</span>
                    {" · "}
                    Sold (est.): <span className="text-zinc-300">{p.soldApprox ?? 0}</span>
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="sr-only" htmlFor={`stock-${p.slug}`}>
                    Stock for {p.name}
                  </label>
                  <input
                    id={`stock-${p.slug}`}
                    type="number"
                    min={0}
                    className="w-28 rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-sm text-white"
                    value={stockDraft[p.slug] ?? String(p.stock ?? 0)}
                    onChange={(e) => setStockDraft((d) => ({ ...d, [p.slug]: e.target.value }))}
                  />
                  <Button
                    type="button"
                    className="rounded-lg"
                    disabled={savingSlug === p.slug}
                    onClick={() => saveStock(p.slug)}
                  >
                    {savingSlug === p.slug ? "Saving…" : "Save"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-zinc-950/50 p-5 sm:p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-white">Orders</h2>
            <div className="flex items-center gap-2">
              <label htmlFor="admin-status-filter" className="text-xs text-zinc-500 uppercase tracking-wider">
                Filter
              </label>
              <select
                id="admin-status-filter"
                className="rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-sm text-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <Button type="button" variant="outline" className="rounded-lg border-white/20 text-sm" onClick={() => load()} disabled={loading}>
                Refresh
              </Button>
            </div>
          </div>

          {loading ? (
            <p className="text-sm text-zinc-500">Loading…</p>
          ) : orders.length === 0 ? (
            <p className="text-sm text-zinc-500">No orders match this filter.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-zinc-500">
                    <th className="pb-3 pr-3">Date</th>
                    <th className="pb-3 pr-3">Order ID</th>
                    <th className="pb-3 pr-3">Customer</th>
                    <th className="pb-3 pr-3">Amount</th>
                    <th className="pb-3 pr-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((o) => {
                    const u = o.userId;
                    const email = typeof u === "object" && u?.email ? u.email : "—";
                    return (
                      <tr key={o._id} className="align-top">
                        <td className="py-3 pr-3 text-zinc-400 whitespace-nowrap">
                          {o.createdAt ? new Date(o.createdAt).toLocaleString() : "—"}
                        </td>
                        <td className="py-3 pr-3 font-mono text-xs text-zinc-200">{o.orderId}</td>
                        <td className="py-3 pr-3 text-zinc-300 max-w-[200px] truncate" title={email}>
                          {email}
                        </td>
                        <td className="py-3 pr-3 whitespace-nowrap">₹{Number(o.amount || 0).toLocaleString("en-IN")}</td>
                        <td className="py-3 pr-3">
                          <select
                            className="max-w-full rounded-lg border border-white/15 bg-black/50 px-2 py-1.5 text-xs text-white"
                            value={o.status}
                            onChange={(e) => updateOrderStatus(o.orderId, e.target.value)}
                          >
                            {ROW_STATUS_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
        </div>
      </div>
    </div>
  );
}
