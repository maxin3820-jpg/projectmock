"use client";
import { useState, useEffect, useCallback } from "react";
import { useAdminStore } from "@/store/adminStore";
import { useAdminData } from "@/lib/hooks/useAdmin";

interface PaymentRow {
  id: string;
  final_amount: number;
  method: string | null;
  status: string;
  created_at: string;
  transaction_ref: string | null;
  profiles: { full_name: string | null; email: string } | null;
  premium_plans: { name: string } | null;
}

export default function Payments() {
  const { showToast, darkMode } = useAdminStore();
  const { getPayments, updatePayment } = useAdminData();
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await getPayments(filter);
    setPayments((data ?? []) as unknown as PaymentRow[]);
    setLoading(false);
  }, [getPayments, filter]);

  useEffect(() => { load(); }, [load]);

  const filtered = payments.filter(p =>
    (p.profiles?.full_name ?? p.profiles?.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const bg = darkMode ? "#0f172a" : "#f8fafc";
  const card = darkMode ? "#1e293b" : "#fff";
  const border = darkMode ? "#334155" : "#e2e8f0";
  const text = darkMode ? "#f1f5f9" : "#0f172a";
  const sub = darkMode ? "#94a3b8" : "#64748b";
  const inputBg = darkMode ? "#0f172a" : "#f8fafc";

  const totalRevenue = payments.filter(p => p.status === "success").reduce((s, p) => s + p.final_amount, 0);
  const sColor = (s: string) => s === "success" ? { bg: "#dcfce7", text: "#16a34a" } : s === "failed" ? { bg: "#fee2e2", text: "#dc2626" } : { bg: "#fef3c7", text: "#92400e" };

  const handleVerify = async (id: string) => {
    const { error } = await updatePayment(id, { status: "success", verified_at: new Date().toISOString() });
    if (error) showToast(error.message, "error");
    else { showToast("Payment verified & subscription activated", "success"); load(); }
  };

  const handleRefund = async (id: string) => {
    const { error } = await updatePayment(id, { status: "refunded" });
    if (error) showToast(error.message, "error");
    else { showToast("Refund processed", "info"); load(); }
  };

  const exportCSV = () => {
    const csv = ["ID,User,Amount,Plan,Method,Status,Date"].concat(
      filtered.map(p => `${p.id},${p.profiles?.full_name ?? ""},${p.final_amount},${p.premium_plans?.name ?? ""},${p.method ?? ""},${p.status},${p.created_at}`)
    ).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "payments.csv"; a.click();
    showToast("Exported", "success");
  };

  return (
    <div style={{ padding: 24, background: bg, minHeight: "100%", overflowY: "auto" }}>
      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Revenue", value: `Rs. ${totalRevenue.toLocaleString()}`, icon: "💰", color: "#16a34a" },
          { label: "Successful", value: payments.filter(p => p.status === "success").length, icon: "✅", color: "#2a5298" },
          { label: "Pending", value: payments.filter(p => p.status === "pending").length, icon: "⏳", color: "#f59e0b" },
          { label: "Failed", value: payments.filter(p => p.status === "failed").length, icon: "❌", color: "#dc2626" },
        ].map(s => (
          <div key={s.label} style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: "16px 18px", display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 26 }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: sub }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search by user..."
          style={{ flex: 1, minWidth: 180, padding: "9px 14px", borderRadius: 10, border: `1.5px solid ${border}`, background: inputBg, color: text, fontSize: 14, outline: "none" }} />
        <select value={filter} onChange={e => { setFilter(e.target.value); }}
          style={{ padding: "9px 12px", borderRadius: 10, border: `1.5px solid ${border}`, background: inputBg, color: text, fontSize: 13, outline: "none" }}>
          <option value="all">All</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
        <button onClick={exportCSV} style={{ padding: "9px 16px", borderRadius: 10, background: "#eff6ff", border: "none", color: "#2563eb", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>⬇ Export</button>
      </div>

      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${border}` }}>
                {["User", "Plan", "Amount", "Method", "Status", "Date", "Ref", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: sub, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${border}` }}>
                    {[...Array(8)].map((_, j) => (
                      <td key={j} style={{ padding: "14px 16px" }}><div style={{ height: 14, background: darkMode ? "#334155" : "#f1f5f9", borderRadius: 4 }} /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: sub }}>No payments found</td></tr>
              ) : filtered.map(p => {
                const sc = sColor(p.status);
                return (
                  <tr key={p.id} style={{ borderBottom: `1px solid ${border}` }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: text }}>{p.profiles?.full_name ?? "—"}</div>
                      <div style={{ fontSize: 11, color: sub }}>{p.profiles?.email}</div>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: sub }}>{p.premium_plans?.name ?? "—"}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: "#16a34a" }}>Rs. {p.final_amount}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: sub }}>{p.method ?? "—"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: sc.bg, color: sc.text }}>{p.status}</span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: sub, whiteSpace: "nowrap" }}>{new Date(p.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: "12px 16px", fontSize: 11, color: sub }}>{p.transaction_ref ?? "—"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 5 }}>
                        {p.status === "pending" && (
                          <button onClick={() => handleVerify(p.id)} style={{ padding: "5px 10px", borderRadius: 7, background: "#dcfce7", border: "none", color: "#16a34a", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Verify</button>
                        )}
                        {p.status === "success" && (
                          <button onClick={() => handleRefund(p.id)} style={{ padding: "5px 10px", borderRadius: 7, background: "#fee2e2", border: "none", color: "#dc2626", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Refund</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
